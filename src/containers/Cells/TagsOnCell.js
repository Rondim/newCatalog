import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TagsOnCell extends Component {
  static propTypes = {
    tags: PropTypes.array
  };
  static defaultProps = {};

  render() {
    const { tags } = this.props;
    return tags.map(({ color, id, name }, index) => {
      const left = index * 15;
      return (
        <div
          className='text-center'
          key={id}
          style={{
            backgroundColor: color,
            width: 15,
            height: 15,
            bottom: 0,
            left,
            position: 'absolute',
            fontWeight: 'bold',
            fontSize: '10px'
          }}
        >{name[0].toUpperCase()}</div>
      );
    });
  }
}

export default TagsOnCell;
