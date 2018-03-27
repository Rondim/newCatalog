import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { compose, graphql } from 'react-apollo/index';
import _ from 'lodash';

import 'react-virtualized/styles.css';
import Toolbar from './Toolbar';
import Sheet from './Sheet';

import setPosition from './mutations/setPosition.graphql';
import loadInstances from './mutations/loadInstancesToSheet.graphql';
import refreshZone from './mutations/refreshZone.graphql';
import query from './queries/fetchCells.graphql';

@compose(
  graphql(setPosition, { name: 'setPosition' }),
  graphql(loadInstances, { name: 'loadInstances' }),
  graphql(refreshZone, { name: 'refreshZone' }),
)
class Cells extends Component {
  static propTypes = {
    setPosition: PropTypes.func,
    loadInstances: PropTypes.func,
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
    const { setPosition, match: { params: { id: sheet } } } = this.props;
    if (i >=0 && j >=0) {
      setPosition({
        variables: { id, row: i, column: j, sheet },
        optimisticResponse: {
          __typename: 'Mutation',
          updateCell: {
            __typename: 'cells',
            id,
            i,
            j
          }
        },
        refetchQueries: [{ query, variables: { sheet } }]
      });
    }
  };

  selectorCells = () => {
    const { selectedCells, selectedCellsByGroup } = this.state;
    if (selectedCellsByGroup) {
      let array = [];
      selectedCellsByGroup.forEach(({ i, j, instance }) => {
        if (instance && instance.id) {
          array.push({
            i,
            j,
            instId: instance.id,
            itemId: instance.item.id
          });
        }
      });
      return array;
    } else return selectedCells;
  };

  handleLoad = async filter => {
    const { id: sheet } = this.props.match.params;
    await this.props.loadInstances({
      variables: { ...this.state.selectedGroupCells, filter, sheet },
      refetchQueries: [{ query, variables: { sheet } }]
    });
  };

  selectManyCells = (i, j, instId, itemId, allCells) => {
    this.setState(prevState => {
      let selectedCells = [...prevState.selectedCells];
      if (!selectedCells.length) return { selectedCells: [{ i, j }] };
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
        selectedGroupCells: { i0, i1, j0, j1 },
        selectedCellsByGroup
      };
    });
  };

  selectSomeCell = (i, j, instId, itemId) => {
    this.setState(prevState => {
      let selectedCells = [...prevState.selectedCells];
      const find =_.findIndex(selectedCells, o => o.i === i && o.j === j);
      if (find !== -1) {
        selectedCells.splice(find, 1);
        return { selectedCells, selectedGroupCells: null };
      }
      selectedCells.push(instId ? { i, j, instId, itemId } : { i, j });
      return { selectedCells, selectedGroupCells: null, selectedCellsByGroup: null };
    });
  };

  selectOneCell = (selectedCells) => {
    this.setState(prevState => ({
      selectedCells,
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
      return { selectedZone };
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
      selectedZone
    } = this.state;
    const { id: sheet } = this.props.match.params;
    const sheetProps = {
      onDrop: this.onDrop,
      selectSomeCells: this.selectSomeCell,
      selectOneCell: this.selectOneCell,
      selectManyCells: this.selectManyCells,
      selectZone: this.selectZone,
      unselectZone: this.unselectZone,
      onStartDrag: this.onStartDrag,
      selectedCells,
      selectedGroupCells,
      selectedZone,
      sheet
    };
    return (
      <Row>
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
            selectedGroupCells={selectedGroupCells}
          />
        </Col>
      </Row>
    );
  }
}

export default Cells;
