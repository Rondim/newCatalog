import { sidebarConfigData } from './fixtures';
import { FILTER_CLICKED, INIT_SIDEBAR } from './constants';


function catalogSidebarReducer(state = {}, action) {
  switch (action.type) {
    case INIT_SIDEBAR:
      return getInitialState(sidebarConfigData);
    case FILTER_CLICKED:
      const newFiltersSelected = calcNewFiltersSelected(state, action.payload);
      return { ...state, filtersSelected: newFiltersSelected };
    default:
      return state;
    }
}

export default catalogSidebarReducer;

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
  const initialState = { ...sidebarConfigData, filtersSelected };
  return initialState;
}
