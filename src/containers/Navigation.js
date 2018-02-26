import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';

import { signoutUser } from './Auth/actions';
import Menu from '../components/Menu';
import query from './Auth/queries/CurentUser.graphql';

@graphql(query)
@connect(null, { signoutUser })
class Navigation extends Component {
  static propTypes = {
    data: PropTypes.object
  };

  render() {
    const { me, loading, refetch } = this.props.data;
    if (loading) return <div />;
    return (
      <div>
        <Menu
          {...this.props}
          authenticated={me && me.id}
          chechAuth = {refetch}
        />
      </div>
    );
  }
}

export default Navigation;
