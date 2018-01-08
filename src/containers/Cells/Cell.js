import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import Instance from './Source';

@observer class Cell extends Component {
  static propTypes = {
    isOverCurrent: PropTypes.bool,
    connectDropTarget: PropTypes.func,
    onDrop: PropTypes.func,
    style: PropTypes.object,
    onSelect: PropTypes.func,
    row: PropTypes.number,
    column: PropTypes.number,
    active: PropTypes.number,
    url: PropTypes.string,
    aId: PropTypes.string,
    instId: PropTypes.string,
    itemId: PropTypes.string,
    tags: PropTypes.array
  };
  static defaultProps = {};

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const tagsExp = nextProps.tags && !this.props.tags ||
      nextProps.tags && nextProps.tags.length !== this.props.tags.length;
    return nextProps.active !== this.props.active || nextProps.aId !== this.props.aId || !!tagsExp;
  }

  handleSelect = ev => {
    const { row, column, onSelect, aId, instId, itemId } = this.props;
    this.setState({ active: true });
    onSelect(ev, row, column, aId, instId, itemId);
  };

  iAmHere = ev => {
    const { row, column, onDrop, url } = this.props;
    if (!url) onDrop(row, column);
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
