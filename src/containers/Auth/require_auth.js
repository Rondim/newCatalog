import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import curentUserQuery from './queries/CurentUser';
import PropTypes from 'prop-types';
import {
  withRouter
} from 'react-router-dom';

export default (WrappedComponent) => {
  class RequireAuth extends Component {
    static propTypes = {
      history: PropTypes.object,
      data: PropTypes.shape({
        user: PropTypes.object,
        loading: PropTypes.bool
      })
    };

    componentWillUpdate({ data: { user, loading } }) {
      if (!loading && !user) {
        this.props.history.push('/signin');
      }
    }

    render() {
      const { loading, user } = this.props.data;
      if (loading) return <div />;
      return <WrappedComponent {...this.props} user={user} />;
    }
  }

  return withRouter(graphql(curentUserQuery, { options: { fetchPolicy: 'network-only' } })(RequireAuth));
};
