import React, { Component } from 'react';
import { connect } from 'react-redux';

import { signoutUser } from './Auth/actions';
import Menu from '../components/Menu';

@connect(null, { signoutUser })
class Navigation extends Component {
  render() {
    return (
      <div>
        <Menu
          {...this.props}
        />
      </div>
    );
  }
}

export default Navigation;
