import _ from 'lodash';

import { FILTER_CLICKED, INIT_SIDEBAR, INSTANCE_SELECTED } from './constants';


function setterSidebarReducer(state = {}, action) {
  switch (action.type) {
    case INIT_SIDEBAR:
      return getInitialState(action.payload);
    case FILTER_CLICKED:
      const newFiltersSelected = calcNewFiltersSelected(state, action.payload);
      return { ...state, filtersSelected: newFiltersSelected };
    case INSTANCE_SELECTED:
      const newFiltersSelectedForSetter = calcNewFiltersSelectedForSetter(action.payload);
      if (_.isEqual(state, newFiltersSelectedForSetter)) {
        return state;
      }
      return newFiltersSelectedForSetter;
    default:
      return state;
    }
}

export default setterSidebarReducer;

const calcNewFiltersSelectedForSetter = ({ someFilters, everyFilters, sidebarConfigData }) => {
  let state = getInitialState(sidebarConfigData);
  let filtersSelected = { ...state.filtersSelected };
  const onlySomeFilters = _.differenceWith(someFilters, everyFilters, _.isEqual);
  onlySomeFilters.forEach(({ id, property }) => {
    // const haveChilds = !!state.dependencies[property.id]['childs'];
    // Почистить детей
    filtersSelected[property.id][id] = 'selectedNotByAll';
  });
  onlySomeFilters.forEach(({ id, property }) => {
    const haveChilds = !!state.dependencies[property.id]['childs'];
    // Почистить детей
    if (haveChilds) {
      const childIds = Object.keys(state.dependencies[property.id]['childs']);
      childIds.forEach(childId => filtersSelected[childId] = {});
    }
  });
  everyFilters.forEach(({ id, property }) => {
    const haveChilds = !!state.dependencies[property.id]['childs'];
    // Почистить детей
    if (haveChilds) {
      const childIds = Object.keys(state.dependencies[property.id]['childs']);
      childIds.forEach(childId => filtersSelected[childId] = {});
    }
    filtersSelected[property.id][id] = 'selected';
  });
  // console.log(state.filtersSelected, filtersSelected);
  state.filtersSelected = filtersSelected;
  return state;
};

function calcNewFiltersSelected(state, filterClicked) {
  const { filtersSelected } = state;
  const { filterGroupId, filterId } = filterClicked;
  const newFiltersSelected = { ...filtersSelected };
  const haveChilds = !!state.dependencies[filterGroupId]['childs'];
  // Почистить детей
  if (haveChilds) {
    const childIds = Object.keys(state.dependencies[filterGroupId]['childs']);
    childIds.forEach(childId => newFiltersSelected[childId] = {});
  }
  // Установить новое значение filtersSelected для этого свойства
  const currentSelection = newFiltersSelected[filterGroupId][filterId];
  if (currentSelection) {
    delete newFiltersSelected[filterGroupId][filterId];
  } else {
    newFiltersSelected[filterGroupId][filterId] = 'selected';
  }
  return newFiltersSelected;
}

function getInitialState(sidebarConfigData) {
  const filtersSelected = {};
  sidebarConfigData.order.forEach(propId => {
    filtersSelected[propId] = {};
  });
  return { ...sidebarConfigData, filtersSelected };
}
