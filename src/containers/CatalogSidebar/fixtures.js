export const sidebarConfigData = {
  order: ['Manufacturer', 'ItemType', 'ItemSubtype', 'Size'],
  sidebarItems: {
    'Manufacturer': {
      type: 'filter',
      name: 'Производитель',
      multiselection: true,
      filtersOrder: ['sokolov', 'delta']
    },
    'ItemType': {
      type: 'filter',
      name: 'Тип Изделия',
      multiselection: true,
      filtersOrder: ['earrings', 'rings']
    },
    'ItemSubtype': {
      type: 'filter',
      name: 'Подтип изделия',
      multiselection: true,
      filtersOrder: ['women', 'children', 'wedding', 'engagement']
    },
    'Size': {
      type: 'filter',
      name: 'Размер',
      multiselection: true,
      filtersOrder: ['s16', 's16_5']
    }
  },
  filters: {
    sokolov: {
      property: 'Manufacturer',
      name: 'Sokolov'
    },
    delta: {
      property: 'Manufacturer',
      name: 'Delta'
    },
    earrings: {
      property: 'ItemType',
      name: 'Серьги'
    },
    rings: {
      property: 'ItemType',
      name: 'Кольца'
    },
    women: {
      property: 'ItemSubtype',
      name: 'Женские',
      dependentOn: { earrings: true }
    },
    children: {
      property: 'ItemSubtype',
      name: 'Детские',
      dependentOn: { earrings: true }
    },
    wedding: {
      property: 'ItemSubtype',
      name: 'Обручальные',
      dependentOn: { rings: true }
    },
    engagement: {
      property: 'ItemSubtype',
      name: 'Помолвочные',
      dependentOn: { rings: true }
    },
    s16: {
      property: 'Size',
      name: '16',
      dependentOn: { rings: true }
    },
    s16_5: {
      property: 'Size',
      name: '16.5',
      dependentOn: { rings: true }
    }
  },
  dependencies: {
    Manufacturer: {
      childs: false,
      parents: false
    },
    ItemType: {
      childs: { ItemSubtype: true, Size: true },
      parents: false
    },
    ItemSubtype: {
      childs: false,
      parents: { ItemType: true }
    },
    Size: {
      childs: false,
      parents: { ItemType: true }
    }
  },
  filtersSelected: {
    Manufacturer: {},
    ItemType: {},
    ItemSubtype: {},
    Size: {}
  }
};
// 
// const sidebarProps = [
//   {
//     type: 'filter',
//     buttonDisplayText: 'Тип Изделия',
//     filterGroupId: 'ItemType',
//     filters: [
//       { filterId: 'filterId1', filterName: 'filterName1', selection: 'selected' },
//       { filterId: 'filterId2', filterName: 'filterName2', selection: 'notSelected' },
//       { filterId: 'filterId3', filterName: 'filterName3', selection: 'selectedNotByAll' }
//     ]
//   }
// ]
