import _ from 'lodash';

let Zone = {};

Zone.updateQuery = (prev, { subscriptionData }, params) => {
  const { Zone: { mutation, previousValues, node } } = subscriptionData.data;
  if (!subscriptionData.data || _.get(node, 'sheetList.id') && _.get(node, 'sheetList.id') !== params) {
    return prev;
  }
  let allZones = [...prev.allZones];
  let index;
  switch (mutation) {
    case 'DELETED':
      index = _.findIndex(allZones, o => o.id === previousValues.id);
      if (~index) {
        allZones.splice(index, 1);
      }
      break;
    case 'CREATED':
      allZones.push(node);
      break;
    case 'UPDATED':
      index = _.findIndex(allZones, o => o.id === previousValues.id);
      allZones[index] = node;
  }
  return Object.assign({}, prev, { allZones });
};


export default Zone;
