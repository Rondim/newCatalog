import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TagsOnCell from './TagsOnCell';

class Source extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func,
    style: PropTypes.object,
    url: PropTypes.string,
    row: PropTypes.number,
    column: PropTypes.number,
    size: PropTypes.string,
    department: PropTypes.string,
    tags: PropTypes.array,
    quantity: PropTypes.number,
    onSelect: PropTypes.func,
    startDrag: PropTypes.func,
    id: PropTypes.string
  };
  static defaultProps = {};

  render() {
    const { style, url, size, department, quantity, startDrag, row, column, id, tags } = this.props;
    const resStyle = {
      width: '100%',
      height: '100%'
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
          { !!tags.length && <TagsOnCell tags={tags} /> }
        </div>);
    }
    return <div style={resStyle} />;
  }
}

export default Source;
