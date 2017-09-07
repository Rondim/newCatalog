import { combineReducers } from 'redux';
import catalogSidebarReducer from './containers/CatalogSidebar/reducer';


export default combineReducers({
  catalogSidebar: catalogSidebarReducer
});
