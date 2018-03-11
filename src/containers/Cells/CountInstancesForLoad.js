import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Badge } from 'reactstrap';

import { fetchCountOptions } from './queries/utils/fetchInstancesCount';
import fetchCount from './queries/fetchInstancesCount.graphql';

@graphql(fetchCount, fetchCountOptions)
class CountInstancesForLoad extends Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool,
      _allInstancesMeta: PropTypes.object
    })
  };
  static defaultProps = {};

  render() {
    const { loading, _allInstancesMeta: info } = this.props.data;
    if (loading) return <div />;
    return (
      <Badge color='info'>{info.count}</Badge>
    );
  }
}

export default CountInstancesForLoad;
