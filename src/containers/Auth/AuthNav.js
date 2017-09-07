/**
 * Created by xax on 24.02.2017.
 */
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  withRouter
} from 'react-router-dom';
import { Button } from 'material-ui';

import query from './queries/CurentUser';
import { signoutUser } from './actions';

class AuthNav extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    signoutUser: PropTypes.func.isRequired
  };

  logout = () => {
    const { history, signoutUser } = this.props;
    history.push('/signin');
    signoutUser();
  };

  render() {
    const { loading, user } = this.props.data;
    if (loading) return <div />;
    return (user ?
      <Button color="contrast" onClick={() => this.logout()}>
        Выход
      </Button>:
      <Button color="contrast" to="/signin">
        Вход
      </Button>
    );
  }
}

export default connect(null, { signoutUser })(
  graphql(query)(withRouter(AuthNav))
);
