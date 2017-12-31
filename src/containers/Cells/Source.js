import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import _ from 'lodash';

const boxSource = {
  beginDrag(props) {
    return {
      source: props
    };
  },
};

@DragSource('instance', boxSource, connect => ({
  connectDragSource: connect.dragSource(),
}))
class Source extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func,
    style: PropTypes.object,
    url: PropTypes.string,
    row: PropTypes.number,
    column: PropTypes.number,
    size: PropTypes.string,
    department: PropTypes.string,
    quantity: PropTypes.number,
    onSelect: PropTypes.func
  };
  static defaultProps = {};

  render() {
    const { connectDragSource, style, url, size, department, quantity } = this.props;
    const resStyle = {
      width: parseInt(style.width)-3,
      height: parseInt(style.height)-3,
    };
    if (url) {
      resStyle.backgroundImage = `url(${url})`;
      resStyle.backgroundSize = style.width;
      return connectDragSource(
        <div
          style={resStyle}
        >
          <div style={{ backgroundColor: 'black', color: 'white', left: 2, position: 'absolute' }}>{size}</div>
          <div style={{ backgroundColor: 'black', color: 'white', right: 2, position: 'absolute' }}>
            {department[0]}
          </div>
          {quantity>1 && <div style={{
            backgroundColor: 'black',
            color: 'white',
            right: 2,
            bottom: 0,
            position: 'absolute'
          }}>{quantity}</div>}
        </div>);
    }
    return <div style={resStyle} />;
  }
}

export default Source;
