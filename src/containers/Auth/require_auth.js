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
      history: PropTypes.object
    };

    componentWillUpdate({ data: { user, loading } }) {
      if (!loading && !user) {
        this.props.history.push('/signin');
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return withRouter(graphql(curentUserQuery, { options: { fetchPolicy: 'network-only' } })(RequireAuth));
};
