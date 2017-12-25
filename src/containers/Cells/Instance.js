import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Instance extends Component {
  static propTypes = {};
  static defaultProps = {};

  render() {
    return (
      <img
        style={style}
        src={this.props.url || ''}
      />
    );
  }
}

export default Instance;
