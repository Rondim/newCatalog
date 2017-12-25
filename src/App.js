import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Catalog from './containers/Catalog';
import Signin from './containers/Auth/signin';
import requireAuth from './containers/Auth/require_auth';
import NavBar from './components/NavBar';
import Cells from './containers/Cells';

const App = () => (
    <div className="App">
      <NavBar />
      <Switch>
        <Route exact path="/" component={requireAuth(Catalog)} />
          <Route exact path="/cells" component={requireAuth(Cells)} />
        <Route path="/signin" component={Signin} />
      </Switch>
    </div>
);

export default App;
