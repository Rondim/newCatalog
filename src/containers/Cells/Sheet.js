import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, AutoSizer } from 'react-virtualized';
import _ from 'lodash';
import { withApollo, graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import Loading from '../../components/Loading';
import Cell from './Cell';

import query from './queries/fetchCells.graphql';
import removeCells from './mutations/removeCells.graphql';
import removeZone from './mutations/removeZone.graphql';
import refreshZone from './mutations/refreshZone.graphql';
import createTextCell from './mutations/createTextCell.graphql';
import updateTextCell from './mutations/updateTextCell.graphql';
// import updateCells from './subscriptions/updateCells.graphql';
// import updateZones from './subscriptions/updateZones.graphql';
import { notification } from '../Notificator/actions';
import {
  calcActive,
  calcStyle,
  checkWebpFeature,
  getQuantity,
  getDepartments,
  getEachCoordOfZone,
} from './libs/calc';
import placeZoneOnSheet from './mutations/placeZoneOnSheet.graphql';
import fetchPads from './queries/allPads.graphql';
import getPad from './queries/getPad.graphql';
import getZone from './queries/getZone.graphql';
import setMultiPosition from './mutations/setMultiPosition.graphql';
import './index.css';

// import Zone from './libs/zone';
// import CellObj from './libs/cellObj';

@connect(null, { notification })
@graphql(query, {
    options: (({ sheet }) => {
      return {
        variables: {
          sheet
        }
      };
    })
  }
)
@compose(
  graphql(setMultiPosition, { name: 'setMultiPosition' }),
  graphql(refreshZone, { name: 'refreshZone' }),
  graphql(removeCells, { name: 'removeCells' }),
  graphql(removeZone, { name: 'removeZone' }),
  graphql(createTextCell, { name: 'createTextCell' }),
  graphql(updateTextCell, { name: 'updateTextCell' }),
  graphql(placeZoneOnSheet, { name: 'placeZoneOnSheet' }),
  withApollo
)
class Sheet extends Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool,
      allCells: PropTypes.array,
      allZones: PropTypes.array,
      _allCellsMeta: PropTypes.object,
      fetchMore: PropTypes.func
    }),
    sheet: PropTypes.string,
    selectedCells: PropTypes.array,
    selectedGroupCells: PropTypes.object,
    selectedZone: PropTypes.object,
    onDrop: PropTypes.func,
    notification: PropTypes.func,
    refreshZone: PropTypes.func,
    removeCells: PropTypes.func,
    removeZone: PropTypes.func,
    selectSomeCells: PropTypes.func,
    selectOneCell: PropTypes.func,
    selectManyCells: PropTypes.func,
    selectZone: PropTypes.func,
    onStartDrag: PropTypes.func,
    createTextCell: PropTypes.func,
    updateTextCell: PropTypes.func,
    placeZoneOnSheet: PropTypes.func,
    setMultiPosition: PropTypes.func,
    busy: PropTypes.object,
    blockingCells: PropTypes.func,
    refetch: PropTypes.func,
    client: PropTypes.object
  };
  static defaultProps = {};

  componentWillMount() {
    checkWebpFeature('lossy', (feature, res) => this.setState({ webp: res }));
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { loading, _allCellsMeta, allCells, fetchMore } = nextProps.data;
    const { sheet } = nextProps;
    if (!loading) {
      if (_allCellsMeta && allCells && _allCellsMeta.count > allCells.length) {
        fetchMore({
          query,
          variables: { skip: allCells.length, sheet },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            return {
              ...previousResult,
              allCells: [...previousResult.allCells, ...fetchMoreResult.allCells],
              _allCellsMeta: fetchMoreResult._allCellsMeta
            };
          }
        });
      } else this._grid && this._grid.forceUpdate();
    }
  }

  componentDidMount() {
    window.addEventListener('resize', () => this.setState({ height: this._container.clientHeight }));
  }

  state={
    webp: false,
    height: document.body.clientHeight-69,
    cutedCells: null
  };

  handleSelectCell = (ev, i, j, instId, itemId) => {
    const { allZones, allCells } = this.props.data;
    const { selectSomeCells, selectOneCell, selectManyCells, selectZone } = this.props;
    if (ev.metaKey) {
      selectSomeCells(i, j, instId, itemId);
    } else if (ev.altKey && ev.shiftKey) {
      selectZone(_.filter(allZones, o => o.type === 'Unique'), i, j);
    } else if (ev.shiftKey) {
      selectManyCells(i, j, instId, itemId, allCells);
    } else if (ev.altKey) {
      selectZone(_.filter(allZones, o => o.type !== 'Unique'), i, j);
    } else {
      const selectedCells = instId ? [{ i, j, instId, itemId }] : [{ i, j }];
      selectOneCell(selectedCells);
    }
  };

  placeZone = (id, i, j) => {
    const { sheet, placeZoneOnSheet, blockingCells, client } = this.props;
    const { pad } = client.readQuery({ query: getPad, variables: { id } });
    const coords = getEachCoordOfZone(i, j, i+pad.size.h-1, j+pad.size.w-1);
    blockingCells(
      placeZoneOnSheet({
        variables: { zoneId: id, sheetId: sheet, i, j },
        refetchQueries: [{ query, variables: { sheet } }]
      }),
      coords
    );
  };

  handleKeyDown = async (ev) => {
    const {
      removeZone, selectedZone, selectedCells, selectedGroupCells, refreshZone, unselectZone, sheet, client,
      blockingCells, setMultiPosition, data: { refetch }
    } = this.props;
    const { cutedCells } = this.state;
    if (ev.keyCode===88 && (ev.ctrlKey || ev.metaKey) && selectedGroupCells) {
      this.setState({ cutedCells: selectedGroupCells });
    } else if (ev.keyCode===86 && (ev.ctrlKey || ev.metaKey) &&
      selectedCells && selectedCells.length > 0 && cutedCells) {
      const cells = this.selectCellsByGroup(cutedCells);
      const { i: ti, j: tj } = selectedCells[0];
      const di = ti - cutedCells.i0;
      const dj = tj - cutedCells.j0;
      const subresult = [];
      const result = [];
      cells.forEach(({ id, i, j }) => {
        subresult.push({ id, i: i+di, j: j+dj, __typename: 'cells' });
        result.push({ id, coord: { i: i+di, j: j+dj } });
      });
      const cellsForBlock = cells.concat(subresult);
      blockingCells(
        setMultiPosition({
          variables: { data: result, sheet },
          optimisticResponse: {
            __typename: 'Mutation',
            updateCells: subresult
          },
          refetchQueries: [{ query, variables: { sheet } }]
        }),
        cellsForBlock,
        refetch
      );
      this.setState({ cutedCells: null });
    } else if (ev.keyCode===82 && ev.altKey && selectedZone) {
      const { pad } = client.readQuery({ query: getZone, variables: { id: selectedZone.id } });
      const coords = getEachCoordOfZone(pad.i0, pad.j0, pad.i1, pad.j1);
      await blockingCells(
        refreshZone({
          variables: { zoneId: selectedZone.id, sheetId: sheet },
          refetchQueries: [{ query, variables: { sheet } }]
        }),
        coords
      );
      this.props.notification('success', 'Зона обновлена');
    } else if (ev.keyCode === 8 || ev.keyCode === 46) {
      if (selectedZone) {
        await removeZone({
          variables: { id: selectedZone.id },
          refetchQueries: [
            { query, variables: { sheet } },
            { query: fetchPads, variables: { search: '' } },
            { query: fetchPads, variables: { typeUnique: true } }
            ]
        });
        unselectZone();
      } else if (selectedGroupCells) {
        const cells = this.selectCellsByGroup(selectedGroupCells);
        await this.removeCells(cells.map(({ i, j }) => ({ i, j })), sheet);
      } else if (selectedCells) {
        await this.removeCells(selectedCells.map(({ i, j }) => ({ i, j })), sheet);
      }
    }
  };

  removeCells = async (coords, sheet) => {
    await this.props.removeCells({
      variables: { coords, sheetId: sheet },
      refetchQueries: [{ query, variables: { sheet } }]
    });
  };

  selectCellsByGroup = ({ i0, i1, j0, j1 }) => {
    const { allCells } = this.props.data;
    return _.filter(allCells, ({ i, j })=> {
      return i>=i0 && i<=i1 && j>=j0 && j<=j1;
    });
  };

  onChangeText = (text, i, j, id) => {
    const { createTextCell, updateTextCell, sheet } = this.props;
    if (id) {
      if (!text) this.removeCells([{ i, j }], sheet);
      else updateTextCell({ variables: { id, text, sheet } });
    } else {
      text && createTextCell({ variables: { i, j, text, sheet }, refetchQueries: [{ query, variables: { sheet } }] });
    }
  };

  cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    const { allCells, allZones } = this.props.data;
    const { selectedCells, selectedGroupCells, selectedZone, onStartDrag, busy } = this.props;
    const { webp } = this.state;
    const data = _.find(allCells, o => o.i===rowIndex && o.j ===columnIndex);
    const avails = _.get(data, 'instance.availabilities');

    let className = '';
    let lBorders = { left: undefined, right: undefined, top: undefined, bottom: undefined };
    let padBorders = { left: undefined, right: undefined, top: undefined, bottom: undefined };
    let aBorders = { left: undefined, right: undefined, top: undefined, bottom: undefined };
    let aZoneBorders = { left: undefined, right: undefined, top: undefined, bottom: undefined };
    typeof allZones === 'object' && allZones.forEach(zone => {
      switch (zone.type) {
        case 'Loader':
          lBorders = calcActive(zone, columnIndex, rowIndex, lBorders);
          break;
        case 'Pad':
          padBorders = calcActive(zone, columnIndex, rowIndex, padBorders);
          break;
        case 'Unique':
          if (zone.i0 <= rowIndex && zone.i1 >= rowIndex && zone.j0 <= columnIndex && zone.j1 >= columnIndex) {
            className += ' uniqueZone';
          }
          break;
      }
    });
    aBorders = calcActive(selectedGroupCells, columnIndex, rowIndex, aBorders);
    const active = !!_.find(selectedCells, o => o.i ===rowIndex && o.j === columnIndex);
    aZoneBorders = selectedZone ? calcActive(selectedZone, columnIndex, rowIndex, aZoneBorders) : aZoneBorders;
    const borderLeft = calcStyle(active, aBorders.left, aZoneBorders.left, lBorders.left, padBorders.left);
    const borderRight = calcStyle(active, aBorders.right, aZoneBorders.right, lBorders.right, padBorders.right);
    const borderTop = calcStyle(active, aBorders.top, aZoneBorders.top, lBorders.top, padBorders.top);
    const borderBottom = calcStyle(active, aBorders.bottom, aZoneBorders.bottom, lBorders.bottom, padBorders.bottom);
    className += ` ${borderLeft}left ${borderRight}right ${borderTop}top ${borderBottom}bottom`;
    let draggable = true;
    if (_.get(busy, `${rowIndex}.${columnIndex}`)) {
      className +=' busy';
      draggable = false;
    }
    const tags = (_.get(data, 'instance.tags')|| [] ).concat(_.get(data, 'instance.item.tags') || []);
    const itemProps = {
      url: _.get(data, 'instance.item.img.url'),
      urlWebp: webp && _.get(data, 'instance.item.imgWebP.url'),
      size: _.get(data, 'instance.size[0].name'),
      departments: getDepartments(avails),
      tags,
      quantity: getQuantity(avails),
      instId: _.get(data, 'instance.id') || null,
      itemId: _.get(data, 'instance.item.id') || null,
      draggable,
      className,
      style
    };
    try {
      return (
        <Cell
          key={key}
          id={data ? data.id : null}
          { ...itemProps }
          text={data && data.text}
          row={rowIndex}
          column={columnIndex}
          onKeyDown={this.handleKeyDown}
          startDrag={(id, i, j) => onStartDrag(id, i, j)}
          onDrop={this.props.onDrop}
          onPlaceZone={this.placeZone}
          onSelect={this.handleSelectCell}
          onChangeText={this.onChangeText}
        />
      );
    } catch (err) {
      console.error(err, data && data.id);
    }
  };

  render() {
    const { loading } = this.props.data;
    if (loading) return <div style={{ height: '100vh' }}><Loading style={{ height: '100%' }} /></div>;
    return (
      <div tabIndex="0" onKeyDown={this.handleKeyDown} style={{ flex: 1 }} ref={ref => this._container = ref} >
        <AutoSizer defaultHeight={600} disableHeight >
          {({ width }) => (
            <Grid
              cellRenderer={this.cellRenderer}
              columnCount={200}
              columnWidth={100}
              height={document.body.clientHeight-69}
              rowCount={300}
              rowHeight={100}
              width={width}
              overscanColumnCount={16}
              overscanRowCount={12}
              scrollingResetTimeInterval={10}
              ref={ref => this._grid = ref}
            />
          )}
        </AutoSizer>
        </div>
    );
  }
}

export default Sheet;
