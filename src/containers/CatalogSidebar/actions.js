import { FILTER_CLICKED, INIT_SIDEBAR } from './constants';

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
