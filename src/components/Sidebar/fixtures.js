export const data = {
  buttonDisplayText: 'Тип Изделия',
  filterGroupId: 'menuId1',
  filters: [
    { filterId: 'filterId1', filterName: 'filterName1', selection: 'selected' },
    { filterId: 'filterId2', filterName: 'filterName2', selection: 'notSelected' },
    { filterId: 'filterId3', filterName: 'filterName3', selection: 'selectedNotByAll' }
  ]
};



const sidebarConfig = [
  {
    type: 'filter',
    property: 'Manufacturer'
  }
];

const sidebarConfigData = [
  {
    type: 'filter',
    property: 'Manufacturer',
    data: {
      propertyName: 'Тип Изделия',
      filterGroupId: 'menuId1',
      filters: [
        { filterId: 'filterId1', filterName: 'filterName1', selection: 'selected' },
        { filterId: 'filterId2', filterName: 'filterName2', selection: 'notSelected' },
        { filterId: 'filterId3', filterName: 'filterName3', selection: 'selectedNotByAll' }
      ]
    }
  },
  {
    type: 'divider'
  },
  {
    type: 'button'
  }
];
