import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { compose, graphql } from 'react-apollo/index';
import _ from 'lodash';

import 'react-virtualized/styles.css';
import Toolbar from './Toolbar';
import Sheet from './Sheet';

import setPosition from './mutations/setPosition.graphql';
import createZone from './mutations/createZone.graphql';
import refreshZone from './mutations/refreshZone.graphql';
import query from './queries/fetchCells.graphql';

@compose(
  graphql(setPosition, { name: 'setPosition' }),
  graphql(createZone, { name: 'createZone' }),
  graphql(refreshZone, { name: 'refreshZone' }),
)
class Cells extends Component {
  static propTypes = {
    setPosition: PropTypes.func,
    createZone: PropTypes.func,
    refreshZone: PropTypes.func,
    subscribeToCells: PropTypes.func,
    subscribeToZones: PropTypes.func,
    match: PropTypes.object
  };
  static defaultProps = {};

  state = {
    counter: false,
    selectedCells: [],
    selectedGroupCells: null,
    selectedCellsByGroup: null,
    selectedZone: null,
    i: undefined,
    j: undefined,
    mode: 'loader'
  };

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
    const { selectedCells, selectedCellsByGroup } = this.state;
    if (selectedCellsByGroup) {
      return selectedCellsByGroup.map(({ i, j, availability }) => {
        return availability &&
          { i, j, aId: availability.id, instId: availability.instance.id, itemId: availability.instance.item.id };
      });
    }
    return selectedCells;
  };

  handleLoad = async filter => {
    const { id: sheet } = this.props.match.params;
    const res = await this.props.createZone({
      variables: { ...this.state.selectedGroupCells, filter, sheet }
    });
    await this.props.refreshZone({
      variables: { zoneId: res.data.createZone.id },
      refetchQueries: [{ query, variables: { sheet } }]
    });
  };

  selectManyCells = (i, j, aId, instId, itemId, allCells) => {
    this.setState(prevState => {
      let selectedCells = [...prevState.selectedCells];
      if (!selectedCells.length) return { selectedCells: [{ i, j, counter: !prevState.counter }] };
      const { i: iF, j: jF } = selectedCells[selectedCells.length -1];
      const i0 = iF < i ? iF : i;
      const j0 = jF < j ? jF : j;
      const i1 = iF > i ? iF : i;
      const j1 = jF > j ? jF : j;
      const selectedCellsByGroup = _.filter(allCells, ({ i, j })=> {
        return i>=i0 && i<=i1 && j>=j0 && j<=j1;
      });
      return {
        selectedCells: [],
        counter: !prevState.counter,
        selectedGroupCells: { i0, i1, j0, j1 },
        selectedCellsByGroup
      };
    });
  };

  selectSomeCell = (i, j, aId, instId, itemId) => {
    this.setState(prevState => {
      let selectedCells = [...prevState.selectedCells];
      const find =_.findIndex(selectedCells, o => o.i === i && o.j === j);
      if (find !== -1) {
        selectedCells.splice(find, 1);
        return { selectedCells, counter: !prevState.counter, selectedGroupCells: null };
      }
      selectedCells.push(aId ? { i, j, aId, instId, itemId } : { i, j });
      return { selectedCells, counter: !prevState.counter, selectedGroupCells: null, selectedCellsByGroup: null };
    });
  };

  selectOneCell = (selectedCells) => {
    this.setState(prevState => ({
      selectedCells,
      counter: !prevState.counter,
      selectedGroupCells: null,
      selectedCellsByGroup: null,
      selectedZone: null
    }));
  };

  selectZone = (allZones, i, j) => {
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
  };

  unselectZone = () => {
    this.setState({ selectedZone: null });
  };

  onStartDrag = (dragItem, i, j) => {
    this.setState({ dragItem, i, j });
  };

  render() {
    const {
      mode,
      selectedCells,
      selectedGroupCells,
      selectedZone,
      counter
    } = this.state;
    const { id: sheet } = this.props.match.params;
    const sheetProps = {
      onDrop: this.onDrop,
      selectSomeCell: this.selectSomeCell,
      selectOneCell: this.selectOneCell,
      selectManyCells: this.selectManyCells,
      selectZone: this.selectZone,
      unselectZone: this.unselectZone,
      onStartDrag: this.onStartDrag,
      selectedCells,
      selectedGroupCells,
      selectedZone,
      counter,
      sheet
    };
    return (
      <Row style={{ flex: '1', height: '100%' }}>
        <Col>
          <Sheet {...sheetProps} />
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
