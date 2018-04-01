import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import _ from 'lodash';

import Instance from './Source';
import TextCell from './TextCell';
import query from './queries/fetchCell.graphql';
import { getDepartments, getQuantity } from './libs/calc';

@withApollo
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
    className: PropTypes.string,
    i: PropTypes.number,
    j: PropTypes.number,
    sheetId: PropTypes.string,
    webp: PropTypes.bool,
    client: PropTypes.object
  };
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state={
      edit: false
      /* text: props.text || '' */
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
    const { style, row, column, sheetId, webp, client, className } = this.props;
    const { edit, text } = this.state;
    let resStyle = { ...style };
    resStyle.borderStyle = 'solid';
    let cell;
    try {
      const data = client.readQuery({ query, variables: { i: row, j: column, sheetId } });
      cell = data.cell;
    } catch (err) {
      cell = null;
    }
    const avails = _.get(cell, 'instance.availabilities');
    const itemProps = {
      ...this.props,
      url: _.get(cell, 'instance.item.img.url'),
      urlWebp: webp && _.get(cell, 'instance.item.imgWebP.url'),
      size: _.get(cell, 'instance.size[0].name'),
      departments: getDepartments(avails),
      tags: _.get(cell, 'instance.tags') || [],
      quantity: getQuantity(avails),
      instId: _.get(cell, 'instance.id') || null,
      itemId: _.get(cell, 'instance.item.id') || null,
      style: resStyle,
      id: cell && cell.id
    };
    // const text = cell ? cell.text : '';
    return (
      <div
        style={resStyle}
        onClick={this.handleSelect}
        onDoubleClick={this.setEdit}
        onDrop={this.iAmHere}
        onDragOver={this.preventDefault}
        className={className}
      >
        {itemProps.url ?
          <Instance {...itemProps} />:
          <TextCell changeText={this.changeText} edit={edit} text={text} />
        }
      </div>
    );
  }
}

export default Cell;
