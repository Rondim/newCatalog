import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Catalog from './containers/Catalog';
import Signin from './containers/Auth/signin';
import requireAuth from './containers/Auth/require_auth';
import Cells from './containers/Cells';
import SheetsManager from './containers/SheetsManager';
import Notificator from './containers/Notificator';
import Navigation from './containers/Navigation';
import Popup from './containers/Popup';

const App = () => (
    <div className="App">
      <div>
        <Navigation authenticated={!!localStorage.getItem('token')} />
      </div>
      <Popup />
      <Notificator />
      <Switch>
        <Route exact path="/" component={requireAuth(Catalog)} />
        <Route exact path="/sheets" component={requireAuth(SheetsManager)} />
          <Route exact path="/sheet/:id" component={requireAuth(Cells)} />
        <Route path="/signin" component={Signin} />
      </Switch>
    </div>
);

export default App;
