import _ from 'lodash';

let CellObj = {};

CellObj.updateQuery = (prev, { subscriptionData }, params) => {
  const { Cell: { mutation, previousValues, node } } = subscriptionData.data;
  if (!subscriptionData.data || _.get(node, 'sheet.id') && _.get(node, 'sheet.id') !== params) {
    return prev;
  }
  let count = _.get(prev, '_allCellsMeta.count') || 0;
  let allCells = [...prev.allCells];
  let _allCellsMeta = { ...prev._allCellsMeta };
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
  _allCellsMeta.count = count;
  return Object.assign({}, prev, { allCells, _allCellsMeta });
};

export default CellObj;
