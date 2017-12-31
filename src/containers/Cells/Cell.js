import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';

import Instance from './Source';
import detectDragModifierKeys from './detectDragModififerKeys';

const boxTarget = {
  drop(props, monitor) {
    const hasDroppedOnChild = monitor.didDrop();
    if (hasDroppedOnChild) {
      return;
    }
    props.onDrop(monitor.getItem(), props);
  },
};

@DropTarget(['instance'], boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
}))
class Cell extends Component {
  static propTypes = {
    isOverCurrent: PropTypes.bool,
    connectDropTarget: PropTypes.func,
    onDrop: PropTypes.func,
    style: PropTypes.object,
    onSelect: PropTypes.func,
    row: PropTypes.number,
    column: PropTypes.number,
    active: PropTypes.bool
  };
  static defaultProps = {};

  handleSelect = ev => {
    const { row, column, onSelect } = this.props;
    onSelect(ev, row, column);
  };

  render() {
    const {
      isOverCurrent,
      connectDropTarget,
      style
    } = this.props;
    let resStyle = { ...style };
    resStyle.backgroundColor = isOverCurrent && 'grey';
    resStyle.borderStyle = 'solid';
    return connectDropTarget(
      <div style={resStyle} onClick={this.handleSelect} >
        <Instance {...this.props} />
      </div>
    );
  }
}

export default Cell;
