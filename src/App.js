import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Catalog from './components/Catalog';
import Signin from './containers/Auth/signin';
import requireAuth from './containers/Auth/require_auth';

const App = () => (
    <div className="App">
      <Switch>
        <Route exact path="/" component={requireAuth(Catalog)} />
        <Route path="/signin" component={Signin} />
      </Switch>
    </div>
);

export default App;
