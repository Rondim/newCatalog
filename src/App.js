import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Catalog from './containers/Catalog';
import Signin from './containers/Auth/signin';
import requireAuth from './containers/Auth/require_auth';
import Cells from './containers/Cells';
import Notificator from './containers/Notificator';
import Navigation from './containers/Navigation';

const App = () => (
    <div className="App">
      <div>
        <Navigation />
      </div>
      <Notificator />
      <Switch>
        <Route exact path="/" component={requireAuth(Catalog)} />
          <Route exact path="/cells" component={requireAuth(Cells)} />
        <Route path="/signin" component={Signin} />
      </Switch>
    </div>
);

export default App;
