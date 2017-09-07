import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker'; //Пока не знаю зачем
import injectTapEventPlugin from 'react-tap-event-plugin'; //Для тача MaterilUI
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers';

import App from './App';

const store = createStore(reducers);

injectTapEventPlugin(); //Чтобы не было задержки при клике в мобилках

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
,document.getElementById('root'));

registerServiceWorker();
