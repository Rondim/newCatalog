import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import curentUserQuery from './queries/CurentUser.graphql';
import PropTypes from 'prop-types';
import {
  withRouter
} from 'react-router-dom';

export default (WrappedComponent) => {
  class RequireAuth extends Component {
    static propTypes = {
      history: PropTypes.object,
      data: PropTypes.shape({
        me: PropTypes.object,
        loading: PropTypes.bool
      })
    };

    componentWillUpdate({ data: { me, loading } }) {
      if (!loading && !me) {
        this.props.history.push('/signin');
      }
    }

    render() {
      const { loading, me } = this.props.data;
      if (loading) return <div />;
      return <WrappedComponent {...this.props} user={me} />;
    }
  }

  return withRouter(graphql(curentUserQuery, { options: { fetchPolicy: 'network-only' } })(RequireAuth));
};
