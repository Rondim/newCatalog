import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';

import * as actions from './actions';

class NotificatorwoConnect extends Component {
  static propTypes = {
    message: PropTypes.string,
    type: PropTypes.string,
  };
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ visible: !!nextProps.message });
  }


  render() {
    const { type, message } = this.props;
    return (
      <div style={{ position: 'fixed', zIndex: 1051, right: 10, top: 10 }}>
        <Alert color={type} isOpen={this.state.visible} toggle={() => this.setState({ visible: false })}>
          <div style={{ paddingRight: '20px' }}>{message}</div>
        </Alert>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    message: state.notify.message,
    type: state.notify.type
  };
}

const Notificator = connect(mapStateToProps, actions)(NotificatorwoConnect);

export default Notificator;
