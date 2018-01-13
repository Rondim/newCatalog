import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context';
import ReduxPromise from 'redux-promise';
import reduxThunk from 'redux-thunk';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { devToolsEnhancer } from 'redux-devtools-extension';
import _ from 'lodash';

import catalogSidebarReducer from './containers/CatalogSidebar/reducer';
import setterSidebarReducer from './containers/SetterSidebar/reducer';
import notifyReducer from './containers/Notificator/reducer';
import { UNAUTH_USER } from './containers/Auth/actions/types';
import { sendNotification } from './containers/Notificator/actions';
import popupReducer from './containers/Popup/reducer';
import { ROOT_URL, WS_URL } from './constants';

const httpLink = new HttpLink({ uri: ROOT_URL });

const wsLink = new WebSocketLink({
  uri: WS_URL,
  options: {
    reconnect: true,
    timeout: 30000,
    connectionParams: {
      authorization: `Bearer ${localStorage.getItem('token') || null}`,
    },
  }
});

const splittedLink = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const cache = new InMemoryCache({
  dataIdFromObject: o => o.id
});

const middlewareLink = setContext(() => ({
  headers: {
    authorization: `Bearer ${localStorage.getItem('token') || null}`,
  }
}));

const appReducer = combineReducers({
  catalogSidebar: catalogSidebarReducer,
  setterSidebar: setterSidebarReducer,
  notify: notifyReducer,
  popup: popupReducer,
});

const reducers = (state, action) => {
  if (action.type === UNAUTH_USER) {
    state = undefined;
  }
  return appReducer(state, action);
};

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (networkError && networkError.statusCode === 401) {
    localStorage.removeItem('token');
  }
  const error = _.get(graphQLErrors, '[0].message');
  if (error) {
    sendNotification(store.dispatch, 'danger', error);
  }
});

export const store = createStore(
  reducers,
  {},
  compose(
    applyMiddleware(
      ReduxPromise,
      reduxThunk,
    ),
    devToolsEnhancer()
  )
);

const link = errorLink.concat(middlewareLink.concat(splittedLink));

export const client = new ApolloClient({
  link,
  cache
});
