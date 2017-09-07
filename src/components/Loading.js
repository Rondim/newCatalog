import React, { Component } from 'react';
import LoadingIndicator from 'react-loading-indicator';

class Loading extends Component {
  render() {
    return (
        <div style={{ paddingLeft: '50%', paddingRight: '50%' }}>
          <LoadingIndicator />
        </div>
    );
  }
}

export default Loading;
