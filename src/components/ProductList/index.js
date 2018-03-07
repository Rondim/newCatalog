import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { Button, IconButton } from 'material-ui';
import Grid from 'material-ui/Grid';
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
    instances: PropTypes.array.isRequired,
    setActive: PropTypes.func,
    fetchMore: PropTypes.func,
    count: PropTypes.number,
    classes: PropTypes.object.isRequired
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
        if (prevState.page < count/24) return { page: prevState.page + 1 };
      } else if (prevState.page > 1) {
        !instances[(prevState.page-2)*24] && fetchMore(prevState.page - 1);
        return { page: prevState.page - 1 };
      }
      return { page: prevState.page };
    });
  };

  renderPages() {
    const { count } = this.props;
    const max = count/24;
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
    const { instances, setActive } = this.props;
    const { page } = this.state;
    let i = 0;
    if (!instances || instances.length === 0) return <Loading />;
    return _.map(instances, instance => {
      if (instance) {
        const { active, complited, item, id } = instance;
        i++;
        if (i <= page * 24 && i > (page - 1) * 24) {
          return (
            <Grid item xs={2} key={id}>
              <ProductListItem
                id={id}
                active={active}
                complited={complited}
                key={id}
                img={item.img.url || 'https://hyperallergic.com/wp-content/uploads/2015/11/Allais_blacksquare-HOME.jpg'}
                handleSelect={this.onSelect}
                disabled={!setActive}
              />
            </Grid>
        );
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
        <IconButton onClick={() => this.handleChangePage(false)}>
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton onClick={() => this.handleChangePage(true)}>
          <KeyboardArrowRight />
        </IconButton>
        <Grid container spacing={24}>
          {this.renderList()}
        </Grid>
        {this.renderPages()}
      </div>
    );
  }
}


export default withStyles(styles)(ProductList);
