import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
    onSelect: PropTypes.func,
    startDrag: PropTypes.func
  };
  static defaultProps = {};

  render() {
    const { style, url, size, department, quantity, startDrag, row, column, id } = this.props;
    const resStyle = {
      width: parseInt(style.width)-3,
      height: parseInt(style.height)-3,
    };
    if (url) {
      resStyle.backgroundImage = `url(${url})`;
      resStyle.backgroundSize = style.width;
      return (
        <div
          onDragStart={() => startDrag(id, row, column)}
          draggable
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
