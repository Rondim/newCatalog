import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TagsOnCell from './TagsOnCell';

class Source extends Component {
  static propTypes = {
    style: PropTypes.object,
    url: PropTypes.string,
    urlWebp: PropTypes.string,
    row: PropTypes.number,
    column: PropTypes.number,
    size: PropTypes.string,
    departments: PropTypes.array,
    tags: PropTypes.array,
    quantity: PropTypes.number,
    onSelect: PropTypes.func,
    startDrag: PropTypes.func,
    id: PropTypes.string,
    inUniqueZone: PropTypes.bool,
    draggable: PropTypes.bool,
    className: PropTypes.string
  };
  static defaultProps = {};

  render() {
    const {
      style, url, size, departments, quantity, startDrag, row, column, id, tags, urlWebp, draggable, className
    } = this.props;
    const resStyle = {
      width: '100%',
      height: '100%'
    };
    if (url) {
      let departmentsString = '';
      departments.forEach(department => {
        departmentsString += department ? `${department[0]}, `: '';
      });
      departmentsString = departmentsString.substring(0, departmentsString.length - 2);
      const link = urlWebp ? `${urlWebp.replace('files.graph.cool', 'images.graph.cool/v1')}/img.webp` :
        `${url.replace('files.graph.cool', 'images.graph.cool/v1')}/200x`;
      resStyle.backgroundImage = `url(${link})`;
      resStyle.backgroundSize = style.width;
      return (
        <div
          onDragStart={() => startDrag(id, row, column)}
          draggable={draggable}
          className={className}
          style={resStyle}
        >
          <div style={{ backgroundColor: 'black', color: 'white', left: 2, position: 'absolute' }}>{size}</div>
          <div style={{ backgroundColor: 'black', color: 'white', right: 2, position: 'absolute' }}>
            {departmentsString}
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
