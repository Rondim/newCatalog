export const sidebarConfigData = {
  order: ['Manufacturer', 'ItemType', 'ItemSubtype', 'Size'],
  sidebarItems: {
    'Manufacturer': {
      type: 'filter',
      name: 'Производитель',
      multiselection: true,
      filtersOrder: ['cj60vqm5zz3ub01780cy0aqgb', 'cj60vqu35z2up0145ub0ech5c']
    },
    'ItemType': {
      type: 'filter',
      name: 'Тип Изделия',
      multiselection: true,
      filtersOrder: ['cj5z4vhdragdw0176xte2m4xn', 'cj5z4vv8damg90163151q9526']
    },
    'ItemSubtype': {
      type: 'filter',
      name: 'Подтип изделия',
      multiselection: true,
      filtersOrder: [
        'cj60wxhrdj72p0103g7nmum3t',
        'cj7cbcjgm1r9h0184xfv69f1h',
        'cj7cbd0ui1r9t01849xaglep9',
        'cj60wy6fzh5h20101xwfn6ha7'
      ]
    },
    'Size': {
      type: 'filter',
      name: 'Размер',
      multiselection: true,
      filtersOrder: ['cj7cbgs7q1rd00184i71p8gsf', 'cj7cbgyxc1pz00115dsfmxaam']
    }
  },
  filters: {
    cj60vqm5zz3ub01780cy0aqgb: {
      property: 'Manufacturer',
      name: 'Sokolov'
    },
    cj60vqu35z2up0145ub0ech5c: {
      property: 'Manufacturer',
      name: 'Delta'
    },
    cj5z4vhdragdw0176xte2m4xn: {
      property: 'ItemType',
      name: 'Серьги'
    },
    cj5z4vv8damg90163151q9526: {
      property: 'ItemType',
      name: 'Кольца'
    },
    cj60wxhrdj72p0103g7nmum3t: {
      property: 'ItemSubtype',
      name: 'Женские',
      dependentOn: { cj5z4vhdragdw0176xte2m4xn: true }
    },
    cj7cbcjgm1r9h0184xfv69f1h: {
      property: 'ItemSubtype',
      name: 'Детские',
      dependentOn: { cj5z4vhdragdw0176xte2m4xn: true }
    },
    cj7cbd0ui1r9t01849xaglep9: {
      property: 'ItemSubtype',
      name: 'Обручальные',
      dependentOn: { cj5z4vv8damg90163151q9526: true }
    },
    cj60wy6fzh5h20101xwfn6ha7: {
      property: 'ItemSubtype',
      name: 'Помолвочные',
      dependentOn: { cj5z4vv8damg90163151q9526: true }
    },
    cj7cbgs7q1rd00184i71p8gsf: {
      property: 'Size',
      name: '16',
      dependentOn: { cj5z4vv8damg90163151q9526: true }
    },
    cj7cbgyxc1pz00115dsfmxaam: {
      property: 'Size',
      name: '16.5',
      dependentOn: { cj5z4vv8damg90163151q9526: true }
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
