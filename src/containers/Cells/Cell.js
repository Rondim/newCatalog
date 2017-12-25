import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import Instance from './Instance';

const boxTarget = {
  drop(props, monitor) {
    const hasDroppedOnChild = monitor.didDrop();
    if (hasDroppedOnChild) {
      return;
    }
    props.onDrop(monitor.getItem(), props.prefix);
  },
};

@DropTarget(['circle', 'square', 'remover', 'segment'], boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
}))
class Cell extends Component {
  static propTypes = {};
  static defaultProps = {};

  render() {
    return (
      <Instance {...this.props} />
    );
  }
}

export default Cell;
