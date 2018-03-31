import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from 'react-loading-indicator';

class Loading extends Component {
  static propTypes = {
    style: PropTypes.object
  };
  render() {
    const { style } = this.props;
    return (
        <div className='d-flex justify-content-center align-items-center' style={style}>
          <LoadingIndicator />
        </div>
    );
  }
}

export default Loading;
