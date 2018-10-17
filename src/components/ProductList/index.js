import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Container, Jumbotron, Row } from 'reactstrap';
import { faArrowLeft, faArrowRight } from '@fortawesome/fontawesome-free-solid';


import './index.css';

import ProductListItem from './ProductListItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const emptyArray = (n) => {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(null);
  }
  return arr;
};

class ProductList extends Component {
  static propTypes = {
    instances: PropTypes.array.isRequired,
    setActive: PropTypes.func,
    fetchMore: PropTypes.func,
    count: PropTypes.number,
  };

  state = {
    page: 1,
    length: 0
  };

  componentWillReceiveProps({ instances }) {
    if (instances.length && instances.length !== this.props.instances.length) {
      this.setState({ length: instances.length });
    }
  }


  componentWillUpdate({ instances }, { page, length }) {
    if (length < this.state.length) this.handleChangePage(null, 1);
  }

  onSelect = (ev) => {
    const { setActive } = this.props;
    ev.preventDefault();
    setActive && setActive(ev.target.id);
  };

  handleKeyDown = (ev) => {
    if (ev.keyCode === 39) {
      this.handleChangePage(true);
    } else if (ev.keyCode === 37) {
      this.handleChangePage(false);
    }
  };

  handleChangePage = (forward, page) => {
    const { count, fetchMore, instances } = this.props;
    this.setState(prevState => {
      if (page) {
        fetchMore(page);
        return { page };
      }
      if (forward) {
        fetchMore(prevState.page + 1);
        if (prevState.page < count / 24) return { page: prevState.page + 1 };
      } else if (prevState.page > 1) {
        !instances[(prevState.page - 2) * 24] && fetchMore(prevState.page - 1);
        return { page: prevState.page - 1 };
      }
      return { page: prevState.page };
    });
  };

  renderPages() {
    const { count } = this.props;
    let max = count / 24;
    if (max > 20) max = 20;
    const pages = [];
    for (let i = 0; i < max; i++) {
      pages.push(i + 1);
    }
    return pages.map(n => {
      return (
        <Button
          color={this.state.page === n ? 'primary' : 'default'}
          key={n}
          onClick={() => this.handleChangePage(null, n)}
        >{n}
        </Button>
      );
    });
  }

  renderRow(row) {
    const { setActive } = this.props;
    console.log(row);
    return row.map((instance, i) => (
      <ProductListItem
        id={instance ? instance.id : ''}
        loading={!instance}
        active={instance ? instance.active : false}
        complited={instance ? instance.complited : false}
        key={i}
        img={
          _.get(instance, 'item.img.url') ||
          'https://i.imgur.com/ujJv4Jw.png'
        }
        handleSelect={this.onSelect}
        disabled={!setActive}
      />
    ));
  }

  renderList() {
    const { instances } = this.props;
    const workingArr = instances && instances.length > 0 ? instances : emptyArray(24);
    const { page } = this.state;
    let arr = workingArr.slice(((page - 1) * 24), page * 24);
    if (arr.length === 0) arr = emptyArray(24);
    const rows = [];
    rows[0] = arr.slice(0, 7);
    rows[1] = arr.slice(8, 15);
    rows[2] = arr.slice(16, 23);
    return rows.map((row, index) => (
      <Row key={index} className='py-3'>
        {this.renderRow(row)}
      </Row>
    ));
  }

  render() {
    return (
      <Container
        tabIndex="1"
        onKeyDown={this.handleKeyDown}
      >
        <div className='d-flex justify-content-center align-items-center'>
          <Button onClick={() => this.handleChangePage(false)}>
            <FontAwesomeIcon
              icon={faArrowLeft}
              size="lg"
            />
          </Button>
          <div className='d-flex justify-content-end w-100'>
            <Button onClick={() => this.handleChangePage(true)}>
              <FontAwesomeIcon
                icon={faArrowRight}
                size="lg"
              />
            </Button>
          </div>
        </div>
        <Jumbotron>
          {this.renderList()}
        </Jumbotron>
        <div className='d-flex flex-fill'>
          <Button onClick={() => this.handleChangePage(false)} className='justify-content-sm-start'>
            <FontAwesomeIcon
              icon={faArrowLeft}
              size="lg"
            />
          </Button>
          <div className='d-flex justify-content-end w-100'>
            <Button onClick={() => this.handleChangePage(true)}>
              <FontAwesomeIcon
                icon={faArrowRight}
                size="lg"
              />
            </Button>
          </div>
        </div>
        {this.renderPages()}
      </Container>
    );
  }
}


export default ProductList;
