import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';

import registerServiceWorker from './registerServiceWorker'; // Пока не знаю зачем
import injectTapEventPlugin from 'react-tap-event-plugin'; // Для тача MaterilUI
import { client, store } from './store';
import { AUTH_USER } from './containers/Auth/actions/types';

import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

injectTapEventPlugin(); // Чтобы не было задержки при клике в мобилках

const token = localStorage.getItem('token');
// If we have a token, consider the user to signed in
if (token) {
  // we need update application state
  store.dispatch({ type: AUTH_USER });
}

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </ApolloProvider>
, document.getElementById('root'));

registerServiceWorker();
