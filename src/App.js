import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Catalog from './components/Catalog';

const App = () => (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Catalog} />
      </Switch>
    </div>
);

export default App;
