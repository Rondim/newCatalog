import React from 'react';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { Paper, Grid } from 'material-ui';
import { connect } from 'react-redux';
import _ from 'lodash';

import ProductList from '../../components/ProductList';
import FetchItems from './queries/FetchItems';
import CatalogSidebar from '../CatalogSidebar';


const styles = theme => ({
  root: {
    margin: [0, 'auto'],
    width: 1024,
  },
  paper: {
    textAlign: 'center'
  }
});

const Catalog = ({ loading, allItems, loadMoreItems, _allItemsMeta, classes }) => (
  <Grid container spacing={8} className={classes.root}>
    <Grid item xs={9}>
      <Paper className={classes.paper}>
        <ProductList
          count={(_allItemsMeta && _allItemsMeta.count) || 0}
          items={loading ? [] : allItems }
          fetchMore={loadMoreItems}
        />
      </Paper>
    </Grid>
    <Grid item xs={3}>
      <Paper className={classes.paper}>
        <CatalogSidebar />
      </Paper>
    </Grid>
  </Grid>
);

Catalog.propTypes = {
  loading: PropTypes.bool,
  allItems: PropTypes.array,
  loadMoreItems: PropTypes.func,
  _allItemsMeta: PropTypes.object,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    filtersSelected: state.catalogSidebar.filtersSelected
  };
};

export default connect(mapStateToProps)(
  graphql(FetchItems, {
  options({ filtersSelected }) {
    let manufacturer;
    let itemType;
    let itemSubtype;
    let size;
    if (filtersSelected) {
      _.map(filtersSelected.Manufacturer, (value, key) => {
        manufacturer = value === 'selected' ? key : undefined;
      });
      _.map(filtersSelected.ItemType, (value, key) => {
        itemType = value === 'selected' ? key : undefined;
      });
      _.map(filtersSelected.ItemSubtype, (value, key) => {
        itemSubtype = value === 'selected' ? key : undefined;
      });
      _.map(filtersSelected.Size, (value, key) => {
        size = value === 'selected' ? key : undefined;
      });
    }
    return {
      variables: {
        skippedItems: 0,
        first: 8,
        manufacturer,
        itemType,
        itemSubtype,
        size
      },
      fetchPolicy: 'network-only',
    };
  },
  props({ data: { loading, allItems, fetchMore, _allItemsMeta }, ownProps: { filtersSelected } }) {
    let manufacturer;
    let itemType;
    let itemSubtype;
    let size;
    if (filtersSelected) {
      _.map(filtersSelected.Manufacturer, (value, key) => {
        manufacturer = value === 'selected' ? key : undefined;
      });
      _.map(filtersSelected.ItemType, (value, key) => {
        itemType = value === 'selected' ? key : undefined;
      });
      _.map(filtersSelected.ItemSubtype, (value, key) => {
        itemSubtype = value === 'selected' ? key : undefined;
      });
      _.map(filtersSelected.Size, (value, key) => {
        size = value === 'selected' ? key : undefined;
      });
    }
    return {
      loading,
      allItems,
      _allItemsMeta,
      loadMoreItems(page) {
        return fetchMore({
          variables: {
            skippedItems: (page-1)*8,
            first: 8,
            manufacturer,
            itemType,
            itemSubtype,
            size
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }
            // let allItems = [...previousResult.allItems];
            let allItems = [];
            previousResult.allItems.forEach((item, index) => {
              if (item) {
                allItems[index] = item;
              }
            });
            let i = (page-1) * 8;
            fetchMoreResult.allItems.forEach(item => {
              allItems[i] = item;
              i++;
            });
            return Object.assign({}, previousResult, { allItems });
          },
        });
      },
    };
  },
})(
  withStyles(styles)(Catalog)
));
