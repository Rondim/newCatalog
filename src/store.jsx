import { ApolloClient, createNetworkInterface } from 'react-apollo';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import ReduxPromise from 'redux-promise';
import reduxThunk from 'redux-thunk';
import { devToolsEnhancer } from 'redux-devtools-extension';
import catalogSidebarReducer from './containers/CatalogSidebar/reducer';
import { UNAUTH_USER } from './containers/Auth/actions/types';


const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/cj5tpc7zsj16i012285uxa6j5'
});
networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};
    }

    // get the authentication token from local storage if it exists
    if (localStorage.getItem('token')) {
      req.options.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    next();
  },
}]);

export const client = new ApolloClient({
  dataIdFromObject: o => o.id,
  networkInterface
});

const appReducer = combineReducers({
  catalogSidebar: catalogSidebarReducer,
  apollo: client.reducer()
});

const reducers = (state, action) => {
  if (action.type === UNAUTH_USER) {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = createStore(
  reducers,
  {},
  compose(
    applyMiddleware(
      ReduxPromise,
      reduxThunk,
      client.middleware()
    ),
    devToolsEnhancer()
  )
);
