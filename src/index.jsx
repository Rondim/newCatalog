import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { client, store } from './store';
import { AUTH_USER } from './containers/Auth/actions/types';

import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

const token = localStorage.getItem('token');
// If we have a token, consider the user to signed in
if (token) {
  // we need update application state
  store.dispatch({ type: AUTH_USER });
}
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
OfflinePluginRuntime.install({
  onInstalled: () => {
    console.log('SW Event:', 'App is ready for offline usage');
  },
  onUpdating: () => {
    console.log('SW Event:', 'onUpdating');
  },
  onUpdateReady: () => {
    console.log('SW Event:', 'onUpdateReady');
    // Tells to new SW to take control immediately
    OfflinePluginRuntime.applyUpdate();
  },
  onUpdated: () => {
    console.log('SW Event:', 'onUpdated');
    // Reload the webpage to load into the new version
    window.location.reload();
  },

  onUpdateFailed: () => {
    console.log('SW Event:', 'onUpdateFailed');
  }
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </ApolloProvider>
, document.getElementById('root'));
