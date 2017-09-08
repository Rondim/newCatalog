import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Catalog from './containers/Catalog';
import Signin from './containers/Auth/signin';
import requireAuth from './containers/Auth/require_auth';
import NavBar from './components/NavBar';

import Test from './components/Test';

const App = () => (
    <div className="App">
      <NavBar />
      <Switch>
        <Route exact path="/" component={requireAuth(Catalog)} />
        <Route path="/signin" component={Signin} />
        <Route path="/test" component={Test} />
      </Switch>
    </div>
);

export default App;
