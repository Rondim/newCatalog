import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Instance from './Source';
import TextCell from './TextCell';

class Cell extends Component {
  static propTypes = {
    id: PropTypes.string,
    isOverCurrent: PropTypes.bool,
    connectDropTarget: PropTypes.func,
    onDrop: PropTypes.func,
    style: PropTypes.object,
    onSelect: PropTypes.func,
    onChangeText: PropTypes.func,
    onPlaceZone: PropTypes.func,
    row: PropTypes.number,
    column: PropTypes.number,
    active: PropTypes.number,
    url: PropTypes.string,
    aId: PropTypes.string,
    instId: PropTypes.string,
    itemId: PropTypes.string,
    tags: PropTypes.array,
    text: PropTypes.string,
    inUniqueZone: PropTypes.bool,
    draggable: PropTypes.bool,
    className: PropTypes.string
  };
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state={
      edit: false,
      text: props.text || ''
    };
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const tagsExp = nextProps.tags && !this.props.tags ||
      nextProps.tags && nextProps.tags.length !== this.props.tags.length;
    return nextProps.active !== this.props.active || nextProps.aId !== this.props.aId ||
      nextProps.inUniqueZone !== this.props.inUniqueZone || tagsExp || this.state.edit !== nextState.edit ||
      this.state.text !== nextState.text || nextProps.className !== this.props.className;
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.text !== this.props.text) {
      this.setState({ text: nextProps.text });
    }
  }


  handleSelect = ev => {
    const { row, column, onSelect, instId, itemId } = this.props;
    this.setState({ active: true });
    onSelect(ev, row, column, instId, itemId);
  };

  iAmHere = ev => {
    const { row, column, onDrop, url, text, onPlaceZone, draggable } = this.props;
    if (draggable) {
      const zone = ev.dataTransfer.getData('id');
      if (zone) onPlaceZone(zone, row, column);
      else if (!url && !text) onDrop(row, column);
    }
  };

  preventDefault = ev => ev.preventDefault();

  setEdit = () => {
    !this.props.url && this.setState(({ edit, text }, { url, onChangeText, row, column, id }) => {
      if (edit) {
        const formatedText = text && text.trim() || '';
        onChangeText(formatedText, row, column, id);
      }
      return { edit: !edit };
    });
  };

  changeText = text => this.setState({ text });

  render() {
    const {
      style,
      url,
      className
    } = this.props;
    const { edit, text } = this.state;
    let resStyle = { ...style };
    resStyle.borderStyle = 'solid';
    return (
      <div
        style={resStyle}
        onClick={this.handleSelect}
        onDoubleClick={this.setEdit}
        onDrop={this.iAmHere}
        onDragOver={this.preventDefault}
        className={className}
      >
        {url ?
          <Instance {...this.props} />:
          <TextCell changeText={this.changeText} edit={edit} text={text} />
        }
      </div>
    );
  }
}

export default Cell;
