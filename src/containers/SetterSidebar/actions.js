import { FILTER_CLICKED, INIT_SIDEBAR, INSTANCE_SELECTED } from './constants';

export function filterClick(filterClicked) {
  return {
    type: FILTER_CLICKED,
    payload: filterClicked
  };
}

export function initSidebar(config) {
  return {
    type: INIT_SIDEBAR,
    payload: config
  };
}

export function instanceSelect(someFilters, everyFilters, sidebarConfigData) {
  return {
    type: INSTANCE_SELECTED,
    payload: { someFilters, everyFilters, sidebarConfigData }
  };
}
