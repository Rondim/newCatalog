import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import * as actions from './actions';

class PopupwoConnect extends Component {
  static propTypes = {
    popup: PropTypes.object,
    confirmation: PropTypes.oneOfType(
      [
        PropTypes.func,
        PropTypes.bool
      ]
    ),
    denial: PropTypes.oneOfType(
      [
        PropTypes.func,
        PropTypes.bool
      ]
    ),
    isOpen: PropTypes.bool,
    header: PropTypes.string,
    body: PropTypes.string,
    denialName: PropTypes.string,
    confirmationName: PropTypes.string
  };
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isOpen: nextProps.popup.isOpen });
  }

  render() {
    const { confirmation, denial, header, body, denialName, confirmationName } = { ...this.props.popup };
    return (
      <Modal isOpen={this.state.isOpen} toggle={() => this.setState({ isOpen: false })}>
        <ModalHeader toggle={() => this.setState({ isOpen: false })}>{header}</ModalHeader>
        <ModalBody>{body}</ModalBody>
        <ModalFooter>
          {denial && <Button color="danger" outline onClick={denial}>{denialName}</Button>}
          {confirmation && <Button color="success" outline onClick={confirmation}>{confirmationName}</Button>}
        </ModalFooter>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    popup: state.popup
  };
}

const Popup = connect(mapStateToProps, actions)(PopupwoConnect);

export default Popup;
