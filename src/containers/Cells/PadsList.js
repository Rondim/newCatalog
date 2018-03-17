import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import { graphql } from 'react-apollo';

import query from './queries/allPads.graphql';
import Loading from '../../components/Loading';

@graphql(query)
class PadsList extends Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool,
      allPads: PropTypes.array
    })
  };
  static defaultProps = {};

  drag = (ev, id, h, w) => {
    let div = document.getElementById(id).cloneNode(true);
    div.classList.remove('w-100');
    div.style.height = h * 100 + 'px';
    div.style.width = w * 100 + 'px';
    div.style.position = 'fixed';
    div.style.top = 0;
    div.style.right = 0;
    div.style.zIndex = -2;
    document.body.appendChild(div);
    let back = document.createElement('div');

    back.style.height = h * 100 + 'px';
    back.style.width = w * 100 + 'px';
    back.style.position = 'fixed';
    back.style.top = 0;
    back.style.right = 0;
    back.style.zIndex = -1;
    back.style.backgroundColor = 'white';
    document.body.appendChild(back);

    ev.dataTransfer.setDragImage(div, 50, 50);
    ev.dataTransfer.setData('id', id);
  };

  renderList() {
    return this.props.data.allPads.map(({ id, name, type, size: { w, h } }) => {
      return (
        <ListGroupItem key={id}>
          <Button
            id={id}
            className='w-100'
            style={{ backgroundColor: type === 'Pad' ? '#cd00c2' : '#00cda9', cursor: 'move' }}
            draggable
            onDragStart={ev => this.drag(ev, id, h, w)}
          >
            {`${name} ${w}x${h}`}
          </Button>
        </ListGroupItem>
      );
    });
  }

  render() {
    if (this.props.data.loading) return <Loading />;
    return (
      <ListGroup>
        {this.renderList()}
      </ListGroup>
    );
  }
}

export default PadsList;
