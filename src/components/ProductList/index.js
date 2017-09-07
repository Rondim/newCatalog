import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { Button, IconButton } from 'material-ui';
import { GridList, GridListTile } from 'material-ui/GridList';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { KeyboardArrowLeft, KeyboardArrowRight } from 'material-ui-icons';


import ProductListItem from './ProductListItem';
import Loading from '../Loading';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    background: theme.palette.background.paper,
  },
  gridList: {
  },
  subheader: {
    width: '100%',
  },
});

class ProductList extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    setActive: PropTypes.func,
    fetchMore: PropTypes.func,
    count: PropTypes.number,
    classes: PropTypes.object.isRequired
  };
  state = {
    page: 1
  };

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
    const { count, fetchMore, items } = this.props;
    this.setState(prevState => {
      if (page) {
        fetchMore(page);
        return { page };
      }
      if (forward) {
        fetchMore(prevState.page + 1);
        if (prevState.page < count/8) return { page: prevState.page + 1 };
      } else if (prevState.page > 1) {
        !items[(prevState.page-2)*8] && fetchMore(prevState.page - 1);
        return { page: prevState.page - 1 };
      }
      return { page: prevState.page };
    });
  };

  /**
   * Renders the component List.
   *
   * @memberof app.components.ProductList.render
   * @return {string} - HTML markup for the component List
   */
  renderPages() {
    const { count } = this.props;
    const max = count/8;
    let pages = [];
    for (let i = 0; i < max; i++) {
      pages.push(i + 1);
    }
    return pages.map(n => {
      return (
        <Button
          raised
          color={this.state.page === n ? 'primary' : 'default' }
          key={n}
          onClick={() => this.handleChangePage(null, n) }
        >{n}
        </Button>
      );
    });
  }

  renderList() {
    const { items, setActive } = this.props;
    const { page } = this.state;
    let i = 0;
    if (items.length === 0) return <Loading />;
    return _.map(items, item => {
      if (item) {
        const { active, complited, img: { url }, id } = item;
        i++;
        if (i <= page * 8 && i > (page - 1) * 8) {
          return (<ProductListItem
            id={id}
            active={active}
            complited={complited}
            key={id}
            img={url}
            handleSelect={this.onSelect}
            disabled={!setActive}
          />);
        }
      } else i++;
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div
        className={classes.root}
        style={{ border: 'var(--border-default)' }}
        tabIndex="1"
        onKeyDown={this.handleKeyDown}
      >
        <GridList cellHeight={40} className={classes.gridList} cols={4}>
          <GridListTile key="Subheader" cols={4} style={{ height: 'auto' }}>
            <IconButton onClick={() => this.handleChangePage(false)}>
              <KeyboardArrowLeft />
            </IconButton>
            <IconButton onClick={() => this.handleChangePage(true)}>
              <KeyboardArrowRight />
            </IconButton>
          </GridListTile>
          {this.renderList()}
          <GridListTile key="footer" cols={4} style={{ height: 'auto' }}>
            {this.renderPages()}
          </GridListTile>
        </GridList>
      </div>
    );
  }
}


export default withStyles(styles)(ProductList);
