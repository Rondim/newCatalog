import React, { Component } from 'react';
import LoadingIndicator from 'react-loading-indicator';

class Loading extends Component {
  render() {
    return (
        <div style={{ flex: 1, paddingLeft: '40%', paddingRight: '40%' }}>
          <LoadingIndicator />
        </div>
    );
  }
}

export default Loading;
