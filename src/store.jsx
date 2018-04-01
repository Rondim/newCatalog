import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { Hermes } from 'apollo-cache-hermes';
import { onError } from 'apollo-link-error';
import ReduxPromise from 'redux-promise';
import reduxThunk from 'redux-thunk';
// import { WebSocketLink } from 'apollo-link-ws';
import { withClientState } from 'apollo-link-state';
import { devToolsEnhancer } from 'redux-devtools-extension';
import _ from 'lodash';

import catalogSidebarReducer from './containers/CatalogSidebar/reducer';
import setterSidebarReducer from './containers/SetterSidebar/reducer';
import notifyReducer from './containers/Notificator/reducer';
import { UNAUTH_USER } from './containers/Auth/actions/types';
import { sendNotification } from './containers/Notificator/actions';
import popupReducer from './containers/Popup/reducer';
import { ROOT_URL, /* WS_URL */ } from './constants';

const httpLink = new HttpLink({
  uri: ROOT_URL,
});

const middlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: `Bearer ${localStorage.getItem('token') || null}`
    }
  });
  return forward(operation);
});

/* const wsLink = new WebSocketLink({
  uri: WS_URL,
  options: {
    reconnect: true,
    timeout: 30000,
    connectionParams: {
      authorization: `Bearer ${localStorage.getItem('token') || null}`,
    },
  }
}); */

const cache = localStorage.getItem('cache') === 'hermes' ? new Hermes() :
  new InMemoryCache({
    dataIdFromObject: object => {
      switch (object.__typename) {
        case 'Cell': return `${object.i}_${object.j}`;
        default: return object.id || object._id; // fall back to `id` and `_id` for all other types
      }
    },
    cacheRedirects: {
      Query: {
        cell: (__, { i, j, sheetId }, { getCacheKey }) => getCacheKey({ __typename: 'Cell', i, j, sheetId })
      },
      Mutation: {
        updateCell: (__, { coord: { i, j }, sheetId }, { getCacheKey }) => {
          console.log('123');
          return getCacheKey({ __typename: 'Cell', i, j, sheetId });
        }
      }
    },
  });

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

export const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        const error = _.get(graphQLErrors, '[0].message');
        if (error) {
          sendNotification(store.dispatch, 'danger', error);
        }
      }
      if (networkError) {
        sendNotification(store.dispatch, 'critical', `Сетевая ошибка ${networkError.statusCode || ''}`);
        if (networkError.statusCode === 401) {
          localStorage.removeItem('token');
        }
      }
    }),
    middlewareLink,
    withClientState({
      defaults: {
        isConnected: true,
        cell: null,
      },
      resolvers: {
        Mutation: {
          updateNetworkStatus: (__, { isConnected }, { cache }) => {
            cache.writeData({ data: { isConnected } });
            return null;
          }
        }
      },
      cache
    }),
    httpLink
  ]),
  cache
});
