import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Instance from './Source';

class Cell extends Component {
  static propTypes = {
    isOverCurrent: PropTypes.bool,
    connectDropTarget: PropTypes.func,
    onDrop: PropTypes.func,
    style: PropTypes.object,
    onSelect: PropTypes.func,
    row: PropTypes.number,
    column: PropTypes.number,
    active: PropTypes.bool,
    url: PropTypes.string
  };
  static defaultProps = {};

  handleSelect = ev => {
    const { row, column, onSelect } = this.props;
    onSelect(ev, row, column);
  };

  iAmHere = ev => {
    const { row, column, onDrop } = this.props;
    onDrop(row, column);
  };

  preventDefault = (ev) => {
    ev.preventDefault();
  };

  render() {
    const {
      style,
      url
    } = this.props;
    let resStyle = { ...style };
    resStyle.borderStyle = 'solid';
    return (
      <div style={resStyle} onClick={this.handleSelect} onDrop={this.iAmHere} onDragOver={this.preventDefault}>
        {url && <Instance {...this.props} />}
      </div>
    );
  }
}

export default Cell;
