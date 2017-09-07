import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import curentUserQuery from './queries/CurentUser';
import { hashHistory } from 'react-router';

export default (WrappedComponent) => {
  class RequireAuth extends Component {
    componentWillUpdate({ data: { user, loading } }) {
      if (!loading && !user) {
        hashHistory.push('/signin');
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return graphql(curentUserQuery, { options: { fetchPolicy: 'network-only' } })(RequireAuth);
};
