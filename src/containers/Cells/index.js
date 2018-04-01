import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { withApollo, compose, graphql } from 'react-apollo/index';
import _ from 'lodash';

import 'react-virtualized/styles.css';
import Toolbar from './Toolbar';
import Sheet from './Sheet';

import setPosition from './mutations/setPosition.graphql';
import loadInstances from './mutations/loadInstancesToSheet.graphql';
import refreshZone from './mutations/refreshZone.graphql';
import query from './queries/fetchCells.graphql';
import fetchCell from './queries/fetchCell.graphql';

@compose(
  graphql(setPosition, { name: 'setPosition' }),
  graphql(loadInstances, { name: 'loadInstances' }),
  graphql(refreshZone, { name: 'refreshZone' }),
  withApollo
)
class Cells extends Component {
  static propTypes = {
    setPosition: PropTypes.func,
    loadInstances: PropTypes.func,
    refreshZone: PropTypes.func,
    subscribeToCells: PropTypes.func,
    subscribeToZones: PropTypes.func,
    match: PropTypes.object,
    client: PropTypes.object
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
    mode: 'loader',
    busy: {}
  };

  onDrop = async (i, j) => {
    const { setPosition, match: { params: { id: sheet } }, client, } = this.props;
    const { dragItem: id, i: si, j: sj, } = this.state;
    if (i >= 0 && j >= 0 && !(i === si && j === sj)) {
      this.setState(prevState => {
        let { busy } = { ...prevState };
        if (!busy[i]) busy[i] = {};
        if (!busy[si]) busy[si] = {};
        busy[i][j] = true;
        busy[si][sj] = true;
        return { busy };
      });
      try {
        let { cell } = client.readQuery({ query: fetchCell, variables: { i: si, j: sj, sheetId: sheet } });
        cell.i = i;
        cell.j = j;
        client.writeQuery({ query: fetchCell, variables: { i, j, sheetId: sheet }, data: { cell: { ...cell } } });
        cell = {
          i: si,
          j: sj,
          id: '',
          instance: null,
          text: null,
          __typename: 'Cell'
        };
        client.writeQuery(
          { query: fetchCell, variables: { i: si, j: sj, sheetId: sheet }, data: { cell: { ...cell } } }
        );
        await setPosition({
          variables: { id, row: i, column: j, sheet }
        });
      } catch (err) {
        console.warn(err);
        let { cell } = client.readQuery({ query: fetchCell, variables: { i, j, sheetId: sheet } });
        cell.i = si;
        cell.j = sj;
        client.writeQuery({
          query: fetchCell, variables: { i: si, j: sj, sheetId: sheet }, data: { cell: { ...cell } }
        });
        cell = {
          i,
          j,
          id: '',
          instance: null,
          text: null,
          __typename: 'Cell'
        };
        client.writeQuery(
          { query: fetchCell, variables: { i, j, sheetId: sheet }, data: { cell: { ...cell } } }
        );
      }
      this.setState(prevState => {
        let { busy } = { ...prevState };
        if (!busy[i]) return prevState;
        if (!busy[si]) return prevState;
        delete busy[i][j];
        delete busy[si][sj];
        if (Object.keys(busy[i]).length === 0) delete busy[i];
        if (busy[si] && Object.keys(busy[si]).length === 0) delete busy[si];
        return { busy };
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

  onStartDrag = (dragItem, i, j) => this.setState({ dragItem, i, j });

  render() {
    const {
      mode,
      selectedCells,
      selectedGroupCells,
      selectedZone,
      busy
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
      sheet,
      busy,
      busyLength: JSON.stringify(busy)
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
