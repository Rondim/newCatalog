import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { Grid, AutoSizer } from 'react-virtualized';

import 'react-virtualized/styles.css';
import Cell from './Cell';
import query from './queries/fetchCells.graphql';
import setPosition from './mutations/setPosition.graphql';
import removeCell from './mutations/removeCell.graphql';
import removeZone from './mutations/removeZone.graphql';
import createZone from './mutations/createZone.graphql';
import refreshZone from './mutations/refreshZone.graphql';
import updateCells from './subscriptions/updateCells.graphql';
import updateZones from './subscriptions/updateZones.graphql';
import Loading from '../../components/Loading';
import Toolbar from './Toolbar';
import { notification } from '../Notificator/actions';

@connect(null, { notification })
@graphql(query, {
  options: (props => {
    const { id: sheet } = props.match.params;
    return {
      variables: {
        sheet
      }
    };
  }),
  props: props => {
    let data = { ...props.data };
    if (!props.data.loading) {
      let _allCellsMeta = { ...props.data._allCellsMeta };
      _allCellsMeta.count = props.data._allCellsMeta.count + Math.random();
      data._allCellsMeta = _allCellsMeta;
    }
    return {
      data: Object.assign({}, data),
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
                if (~index) {
                  allCells.splice(index, 1);
                  count--;
                }
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
      },
      subscribeToZones: params => {
        return props.data.subscribeToMore({
          document: updateZones,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }
            const { Zone: { mutation, previousValues, node } } = subscriptionData.data;
            let { count } = prev._allCellsMeta;
            let allZones = [...prev.allZones];
            let index;
            switch (mutation) {
              case 'DELETED':
                index = _.findIndex(allZones, o => o.id === previousValues.id);
                allZones.splice(index, 1);
                count--;
                break;
              case 'CREATED':
                allZones.push(node);
                count++;
                break;
              case 'UPDATED':
                index = _.findIndex(allZones, o => o.id === previousValues.id);
                allZones[index] = node;
            }
            return Object.assign({}, prev, { allZones, _allCellsMeta: { count } });
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
class Cells extends Component {
  static propTypes = {
    setPosition: PropTypes.func,
    createZone: PropTypes.func,
    refreshZone: PropTypes.func,
    removeCell: PropTypes.func,
    subscribeToCells: PropTypes.func,
    subscribeToZones: PropTypes.func,
    notification: PropTypes.func,
    match: PropTypes.object,
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
    selectedZone: null,
    i: undefined,
    j: undefined,
    mode: 'loader'
  };

  componentWillMount() {
    this.props.subscribeToCells();
    this.props.subscribeToZones();
  }

  onDrop = async (i, j) => {
    const { dragItem: id } = this.state;
    if (i >=0 && j >=0) {
      this.props.setPosition({ variables: { id, row: i, column: j }, optimisticResponse: {
          __typename: 'Mutation',
          updateCell: {
            __typename: 'cells',
            id,
            i,
            j
          }
        } }).then(() => this.setState(prevState => ({ counter: !prevState.counter })));
      this.setState(prevState => ({ counter: !prevState.counter }));
    }
  };

  selectorCells = () => {
    const { selectedCells, selectedGroupCells } = this.state;
    if (selectedGroupCells) {
      return this.selectCellsByGroup().map(({ i, j, availability }) => {
        return { i, j, aId: availability.id, instId: availability.instance.id, itemId: availability.instance.item.id };
      });
    }
    return selectedCells;
  };

  selectCellsByGroup = () => {
    const { selectedGroupCells: { i0, i1, j0, j1 } } = this.state;
    const { allCells } = this.props.data;
    return _.filter(allCells, ({ i, j })=> {
      return i>=i0 && i<=i1 && j>=j0 && j<=j1;
    });
  };

  handleSelectCell = (ev, i, j, aId, instId, itemId) => {
    const { allZones } = this.props.data;
    if (ev.metaKey) {
      this.setState(prevState => {
        let selectedCells = [...prevState.selectedCells];
        const find =_.findIndex(selectedCells, o => o.i === i && o.j === j);
        if (find !== -1) {
          selectedCells.splice(find, 1);
          return { selectedCells, counter: !prevState.counter, selectedGroupCells: null };
        }
        selectedCells.push(aId ? { i, j, aId, instId, itemId } : { i, j });
        return { selectedCells, counter: !prevState.counter, selectedGroupCells: null };
      });
    } else if (ev.shiftKey) {
      this.setState(prevState => {
        let selectedCells = [...prevState.selectedCells];
        if (!selectedCells.length) return { selectedCells: [{ i, j, counter: !prevState.counter }] };
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
      const selectedCells = aId ? [{ i, j, aId, instId, itemId }] : [{ i, j }];
      this.setState(prevState => ({
        selectedCells,
        counter: !prevState.counter,
        selectedGroupCells: null,
        selectedZone: null
      }));
    }
  };

  handleLoad = async filter => {
    const { id: sheet } = this.props.match.params;
    const res = await this.props.createZone({
      variables: { ...this.state.selectedGroupCells, filter, sheet }
    });
    await this.props.refreshZone({
      variables: { zoneId: res.data.createZone.id }
    });
  };

  removeCell = id => {
    const { id: sheet } = this.props.match.params;
    this.props.removeCell({
      variables: { id },
      optimisticResponse: {
        __typename: 'Mutation',
        deleteCell: {
          __typename: 'cell',
          id,
        }
      },
      update: (proxy, { data: { deleteCell } }) => {
        const data = proxy.readQuery({ query, variables: { sheet } });
        const index = _.findIndex(data.allCells, o => o.id === deleteCell.id);
        if (~index) data.allCells.splice(index, 1);
        data._allCellsMeta.count--;
        proxy.writeQuery({ query, variables: { sheet }, data });
      },
    });
  };

  handleKeyDown = async (ev) => {
    const { selectedZone, selectedCells, selectedGroupCells } = this.state;
    const { removeZone, data: { allCells } } = this.props;
    console.log(ev.keyCode);
    if (ev.keyCode===82 && ev.altKey && selectedZone) {
      await this.props.refreshZone({
        variables: { zoneId: selectedZone.id }
      });
      this.props.notification('success', 'Зона обновлена');
    } else if (ev.keyCode === 8 || ev.keyCode === 46) {
      if (selectedZone) {
        await removeZone({ variables: { id: selectedZone.id } });
        this.setState(prevState => ({ counter: !prevState.counter, selectedZone: null }));
      } else if (selectedGroupCells) {
        const cells = this.selectCellsByGroup();
        await Promise.all(cells.map(({ id }) => this.removeCell(id)))
          .then(() => this.rerenderCells);
      } else if (selectedCells) {
        await Promise.all(selectedCells.map(({ i, j }) => {
          const cell = _.find(allCells, o=> o.i ===i && o.j===j);
          if (cell) {
            return this.removeCell(cell.id);
          }
        })).then(() => this.rerenderCells);
      }
    }
    this.setState(prevState => ({ counter: !prevState.counter }));
  };

  rerenderCells = () => {
    this.setState(prevState => ({ counter: !prevState.counter }));
  };

  cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    const { allCells, allZones } = this.props.data;
    const { selectedCells, selectedGroupCells, selectedZone } = this.state;
    const data = _.find(allCells, o => o.i===rowIndex && o.j ===columnIndex);
    let zoneLeft;
    let zoneRight;
    let zoneTop;
    let zoneBottom;
    let activeLeft;
    let activeRight;
    let activeTop;
    let activeBottom;
    let newStyle = { ...style };
    data && !data.availability.instance.item.img && console.log(data.id);
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
      newStyle.borderLeftWidth = '3px';
      newStyle.borderLeftColor = '#5baaff';
    } else if (activeLeft && zoneLeft) {
      newStyle.borderLeftWidth = '3px';
      newStyle.borderLeftColor = '#00ff05';
    } else if (zoneLeft) {
      newStyle.borderLeftWidth = '3px';
      newStyle.borderLeftColor = '#00ffd3';
    } else {
      newStyle.borderLeftWidth = '1px';
      newStyle.borderLeftColor = 'grey';
    }
    if (active || activeRight && !zoneRight) {
      newStyle.borderRightWidth = '3px';
      newStyle.borderRightColor = '#5baaff';
    } else if (activeRight && zoneRight) {
      newStyle.borderRightWidth = '3px';
      newStyle.borderRightColor = '#00ff05';
    } else if (zoneRight) {
      newStyle.borderRightWidth = '3px';
      newStyle.borderRightColor = '#00ffd3';
    } else {
      newStyle.borderRightWidth = '1px';
      newStyle.borderRightColor = 'grey';
    }
    if (active || activeTop && !zoneTop) {
      newStyle.borderTopWidth = '3px';
      newStyle.borderTopColor = '#5baaff';
    } else if (activeTop && zoneTop) {
      newStyle.borderTopWidth = '3px';
      newStyle.borderTopColor = '#00ff05';
    } else if (zoneTop) {
      newStyle.borderTopWidth = '3px';
      newStyle.borderTopColor = '#00ffd3';
    } else {
      newStyle.borderTopWidth = '1px';
      newStyle.borderTopColor = 'grey';
    }
    if (active || activeBottom && !zoneBottom) {
      newStyle.borderBottomWidth = '3px';
      newStyle.borderBottomColor = '#5baaff';
    } else if (activeBottom && zoneBottom) {
      newStyle.borderBottomWidth = '3px';
      newStyle.borderBottomColor = '#00ff05';
    } else if (zoneBottom) {
      newStyle.borderBottomWidth = '3px';
      newStyle.borderBottomColor = '#00ffd3';
    } else {
      newStyle.borderBottomWidth = '1px';
      newStyle.borderBottomColor = 'grey';
    }
    return (
      <Cell
        key={key}
        active={active && 1 || activeLeft && 1 || activeRight && 1 || activeBottom && 1 || activeTop && 1 ||
        zoneLeft && 2 || zoneBottom && 2 || zoneTop && 2 || zoneRight && 2}
        url={data && data.availability.instance && data.availability.instance.item.img.url}
        size={data && data.availability.instance && data.availability.instance.size.name}
        department={data && data.availability.department[0].name}
        tags={data && data.availability.tags}
        quantity={data && data.availability.quantity}
        aId = {data && data.availability.id || null}
        instId = {data && data.availability.instance.id || null}
        itemId = {data && data.availability.instance.item.id || null}
        style={newStyle}
        row={rowIndex}
        column={columnIndex}
        id={data ? data.id : null}
        onKeyDown={this.handleKeyDown}
        startDrag={(id, i, j) => this.setState({ dragItem: id, i, j })}
        onDrop={this.onDrop}
        onSelect={this.handleSelectCell}
      />
    );
  };

  render() {
    const { counter, mode } = this.state;
    const { id: sheet } = this.props.match.params;
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
                  count={_allCellsMeta.count}
                  overscanColumnCount={16}
                  overscanRowCount={12}
                  scrollingResetTimeInterval={10}
                  counter={counter}
                />
              )}
            </AutoSizer>
          </div>
        </Col>
        <Col xs='auto'>
          <Toolbar
            onLoad={this.handleLoad}
            mode={mode}
            changeMode={mode => this.setState({ mode })}
            selectedCells={ this.selectorCells() }
            sheet={sheet}
          />
        </Col>
      </Row>
    );
  }
}

export default Cells;
