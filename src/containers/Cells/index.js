import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Grid, AutoSizer } from 'react-virtualized';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import 'react-virtualized/styles.css';
import Cell from './Cell';
import query from './queries/fetchCells';
import setPosition from './mutations/setPosition';
import removeCell from './mutations/removeCell';
import removeZone from './mutations/removeZone';
import createZone from './mutations/createZone';
import refreshZone from './mutations/refreshZone';
import updateCells from './subscriptions/updateCells';
import Loading from '../../components/Loading';
import Toolbar from './Toolbar';
import { notification } from '../Notificator/actions';

const sheet = 'cjbnm5axu1kdt01475y4ak9lz';

@connect(null, { notification })
@graphql(query, {
  options: (props => {
    return {
      variables: {
        sheet
      }
    };
  }),
  props: props => {
    return {
      data: props.data,
      subscribeToCells: params => {
        return props.data.subscribeToMore({
          document: updateCells,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }
            const { Cell: { mutation, previousValues, node } } = subscriptionData.data;
            let { count } = prev._allCellsMeta;
            let allCells = [...prev.allCells];
            let index;
            switch (mutation) {
              case 'DELETED':
                index = _.findIndex(allCells, o => o.id === previousValues.id);
                allCells.splice(index, 1);
                count--;
                break;
              case 'CREATED':
                allCells.push(node);
                count++;
                break;
              case 'UPDATED':
                index = _.findIndex(allCells, o => o.id === previousValues.id);
                allCells[index] = node;
            }
            return Object.assign({}, prev, { allCells, _allCellsMeta: { count } });
          }
        });
      }
    };
  }
  }
)
@compose(
  graphql(setPosition, { name: 'setPosition' }),
  graphql(createZone, { name: 'createZone' }),
  graphql(refreshZone, { name: 'refreshZone' }),
  graphql(removeCell, { name: 'removeCell' }),
  graphql(removeZone, { name: 'removeZone' }),
)
@DragDropContext(HTML5Backend)
class Cells extends Component {
  static propTypes = {
    setPosition: PropTypes.func,
    createZone: PropTypes.func,
    refreshZone: PropTypes.func,
    removeCell: PropTypes.func,
    subscribeToCells: PropTypes.func,
    notification: PropTypes.func,
    data: PropTypes.shape({
      loading: PropTypes.bool,
      allCells: PropTypes.array,
      allZones: PropTypes.array,
      _allCellsMeta: PropTypes.object
    })
  };
  static defaultProps = {};

  state = {
    counter: false,
    selectedCells: [],
    selectedGroupCells: null,
    selectedZone: null
  };

  componentWillMount() {
    this.props.subscribeToCells();
  }

  onDrop = async ({ source: { id } }, { row, column }) => {
    this.props.setPosition({ variables: { id, row, column }, optimisticResponse: {
        __typename: 'Mutation',
        updateCell: {
          __typename: 'cells',
          id,
          i: row,
          j: column
        }
      } }).then(() => this.setState(prevState => ({ counter: !prevState.counter })));
    this.setState(prevState => ({ counter: !prevState.counter }));
  };

  handleSelectCell = (ev, i, j) => {
    const { allZones } = this.props.data;
    if (ev.metaKey) {
      this.setState(prevState => {
        let selectedCells = [...prevState.selectedCells];
        const find =_.findIndex(selectedCells, o => o.i === i && o.j === j);
        if (find !== -1) {
          selectedCells.splice(find, 1);
          return { selectedCells, counter: !prevState.counter, selectedGroupCells: null };
        }
        selectedCells.push({ i, j });
        return { selectedCells, counter: !prevState.counter, selectedGroupCells: null };
      });
    } else if (ev.shiftKey) {
      this.setState(prevState => {
        let selectedCells = [...prevState.selectedCells];
        if (!selectedCells.length) return { selectedCells: [{ i, j }] };
        const { i: iF, j: jF } = selectedCells[selectedCells.length -1];
        const i0 = iF < i ? iF : i;
        const j0 = jF < j ? jF : j;
        const i1 = iF > i ? iF : i;
        const j1 = jF > j ? jF : j;
        return { selectedCells: [], counter: !prevState.counter, selectedGroupCells: { i0, i1, j0, j1 } };
      });
    } else if (ev.altKey) {
      this.setState(prevState => {
        let selectedZone = null;
        allZones.every(zone => {
          if (i>=zone.i0 && i<=zone.i1 && j>=zone.j0 && j<=zone.j1) {
            if (prevState.selectedZone && prevState.selectedZone.id === zone.id) {
              selectedZone = null;
            } else {
              selectedZone = zone;
            }
            return false;
          }
          return true;
        });
        return { selectedZone, counter: !prevState.counter };
      });
    } else {
      this.setState(prevState => ({
        selectedCells: [{ i, j }],
        counter: !prevState.counter,
        selectedGroupCells: null,
        selectedZone: null
      }));
    }
  };

  handleLoad = async filter => {
    const res = await this.props.createZone({
      variables: { ...this.state.selectedGroupCells, filter, sheet }
    });
    await this.props.refreshZone({
      variables: { zoneId: res.data.createZone.id }
    });
  };

  handleKeyDown = async (ev) => {
    const { selectedZone, selectedCells, selectedGroupCells } = this.state;
    const { removeCell, removeZone, data: { allCells } } = this.props;
    if (ev.keyCode===82 && ev.altKey && selectedZone) {
      await this.props.refreshZone({
        variables: { zoneId: selectedZone.id }
      });
      this.props.notification('success', 'Зона обновлена');
    } else if (ev.keyCode === 8 || ev.keyCode === 46) {
      if (selectedZone) {
        await removeZone({ variables: { id: selectedZone.id } });
        this.setState(prevState => ({ counter: !prevState.counter }));
      } else if (selectedGroupCells) {
        console.log(selectedGroupCells);
      } else if (selectedCells) {
        await Promise.all(selectedCells.map(({ i, j }) => {
          const cell = _.find(allCells, o=> o.i ===i && o.j===j);
          if (cell) {
            return removeCell({
              variables: { id: cell.id },
              optimisticResponse: {
                __typename: 'Mutation',
                deleteCell: {
                  __typename: 'cell',
                  id: cell.id,
                }
              }
            });
          }
        })).then(() => this.setState(prevState => ({ counter: !prevState.counter })));
      }
    }
    this.setState(prevState => ({ counter: !prevState.counter }));
  };

  cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    const { loading, allCells, allZones } = this.props.data;
    const { selectedCells, selectedGroupCells, selectedZone } = this.state;
    const data = _.find(allCells, o => o.i===rowIndex && o.j ===columnIndex);
    if (loading) return <Loading />;
    let zoneLeft, zoneRight, zoneTop, zoneBottom;
    let activeLeft, activeRight, activeTop, activeBottom;
    allZones.forEach(zone => {
      zoneLeft = zone.j0 === columnIndex
        && zone.i0 <= rowIndex && zone.i1 >= rowIndex || zoneLeft;
      zoneRight = zone.j1 === columnIndex
        && zone.i0 <= rowIndex && zone.i1 >= rowIndex || zoneRight;
      zoneTop = zone.i0 === rowIndex
        && zone.j0 <= columnIndex && zone.j1 >= columnIndex || zoneTop;
      zoneBottom = zone.i1 === rowIndex
        && zone.j0 <= columnIndex && zone.j1 >= columnIndex || zoneBottom;
    });
    activeLeft = selectedGroupCells && selectedGroupCells.j0 === columnIndex
      && selectedGroupCells.i0 <= rowIndex && selectedGroupCells.i1 >= rowIndex;
    activeRight = selectedGroupCells && selectedGroupCells.j1 === columnIndex
      && selectedGroupCells.i0 <= rowIndex && selectedGroupCells.i1 >= rowIndex;
    activeTop = selectedGroupCells && selectedGroupCells.i0 === rowIndex
      && selectedGroupCells.j0 <= columnIndex && selectedGroupCells.j1 >= columnIndex;
    activeBottom = selectedGroupCells && selectedGroupCells.i1 === rowIndex
      && selectedGroupCells.j0 <= columnIndex && selectedGroupCells.j1 >= columnIndex;
    const active = !!_.find(selectedCells, o => o.i ===rowIndex && o.j === columnIndex);
    if (selectedZone) {
      activeLeft = selectedZone.j0 === columnIndex
        && selectedZone.i0 <= rowIndex && selectedZone.i1 >= rowIndex || activeLeft;
      activeRight = selectedZone.j1 === columnIndex
        && selectedZone.i0 <= rowIndex && selectedZone.i1 >= rowIndex || activeRight;
      activeTop = selectedZone.i0 === rowIndex
        && selectedZone.j0 <= columnIndex && selectedZone.j1 >= columnIndex || activeTop;
      activeBottom = selectedZone.i1 === rowIndex
        && selectedZone.j0 <= columnIndex && selectedZone.j1 >= columnIndex || activeBottom;
    }
    if (active || activeLeft && !zoneLeft) {
      style.borderLeftWidth = '3px';
      style.borderLeftColor = '#5baaff';
    } else if (activeLeft && zoneLeft) {
      style.borderLeftWidth = '3px';
      style.borderLeftColor = '#00ff05';
    } else if (zoneLeft) {
      style.borderLeftWidth = '3px';
      style.borderLeftColor = '#00ffd3';
    } else {
      style.borderLeftWidth = '1px';
      style.borderLeftColor = 'grey';
    }
    if (active || activeRight && !zoneRight) {
      style.borderRightWidth = '3px';
      style.borderRightColor = '#5baaff';
    } else if (activeRight && zoneRight) {
      style.borderRightWidth = '3px';
      style.borderRightColor = '#00ff05';
    } else if (zoneRight) {
      style.borderRightWidth = '3px';
      style.borderRightColor = '#00ffd3';
    } else {
      style.borderRightWidth = '1px';
      style.borderRightColor = 'grey';
    }
    if (active || activeTop && !zoneTop) {
      style.borderTopWidth = '3px';
      style.borderTopColor = '#5baaff';
    } else if (activeTop && zoneTop) {
      style.borderTopWidth = '3px';
      style.borderTopColor = '#00ff05';
    } else if (zoneTop) {
      style.borderTopWidth = '3px';
      style.borderTopColor = '#00ffd3';
    } else {
      style.borderTopWidth = '1px';
      style.borderTopColor = 'grey';
    }
    if (active || activeBottom && !zoneBottom) {
      style.borderBottomWidth = '3px';
      style.borderBottomColor = '#5baaff';
    } else if (activeBottom && zoneBottom) {
      style.borderBottomWidth = '3px';
      style.borderBottomColor = '#00ff05';
    } else if (zoneBottom) {
      style.borderBottomWidth = '3px';
      style.borderBottomColor = '#00ffd3';
    } else {
      style.borderBottomWidth = '1px';
      style.borderBottomColor = 'grey';
    }
    return (
      <Cell
        key={key}
        url={data && data.availability.instance && data.availability.instance.item.img.url}
        size={data && data.availability.instance && data.availability.instance.size.name}
        department={data && data.availability.department[0].name}
        quantity={data && data.availability.quantity}
        style={style}
        row={rowIndex}
        column={columnIndex}
        onDrop={this.onDrop}
        id={data ? data.id : null}
        onSelect={this.handleSelectCell}
        onKeyDown={this.handleKeyDown}
      />
    );
  };

  render() {
    const { counter } = this.state;
    const { loading, _allCellsMeta } = this.props.data;
    if (loading) return <Loading />;
    return (
      <Row style={{ flex: '1', height: '100%' }}>
        <Col>
          <div tabIndex="0" onKeyDown={this.handleKeyDown} style={{ flex: '1', height: '100%' }}>
            <AutoSizer defaultHeight={600}>
              {({ height, width }) => (
              <Grid
                cellRenderer={this.cellRenderer}
                columnCount={200}
                columnWidth={100}
                height={height}
                rowCount={300}
                rowHeight={100}
                width={width}
                counter={counter}
                count={_allCellsMeta.count}
                overscanColumnCount={50}
                overscanRowCount={50}
                scrollingResetTimeInterval={10}
              />
                )}
            </AutoSizer>
          </div>
        </Col>
        <Col xs='auto'>
          <Toolbar onLoad={this.handleLoad} />
        </Col>
      </Row>
    );
  }
}

export default Cells;
