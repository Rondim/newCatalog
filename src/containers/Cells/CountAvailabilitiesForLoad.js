import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Badge } from 'reactstrap';

import { fetchCountOptions } from './queries/utils/fetchAvailabilitiesCount';
import fetchCount from './queries/fetchAvailabilitiesCount.graphql';

@graphql(fetchCount, fetchCountOptions)
class CountAvailabilitiesForLoad extends Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool,
      _allAvailabilitiesMeta: PropTypes.object
    })
  };
  static defaultProps = {};

  render() {
    const { loading, _allAvailabilitiesMeta: info } = this.props.data;
    if (loading) return <div />;
    return (
      <Badge color='info'>{info.count}</Badge>
    );
  }
}

export default CountAvailabilitiesForLoad;
