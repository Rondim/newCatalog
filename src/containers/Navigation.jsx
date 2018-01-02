import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';

import { signoutUser } from './Auth/actions';
import Menu from '../components/Menu';
import query from './Auth/queries/CurentUser';

@graphql(query)
@connect(null, { signoutUser })
class Navigation extends Component {
  static propTypes = {
    data: PropTypes.object,
    updateBrief: PropTypes.func,
    createBrief: PropTypes.func
  };

  render() {
    const { user, loading, refetch } = this.props.data;
    if (loading) return <div />;
    return (
      <div>
        <Menu
          {...this.props}
          authenticated={user && user.id}
          chechAuth = {refetch}
        />
      </div>
    );
  }
}

export default Navigation;
