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

const Catalog = ({ loading, allItems, loadMoreItems, _allItemsMeta, classes, sidebarConfigData }) => (
  <Grid container spacing={8} className={classes.root}>
    {console.log(loading, sidebarConfigData)}
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
        {!loading && <CatalogSidebar config={sidebarConfigData} />}
      </Paper>
    </Grid>
  </Grid>
);

Catalog.propTypes = {
  loading: PropTypes.bool,
  allItems: PropTypes.array,
  loadMoreItems: PropTypes.func,
  _allItemsMeta: PropTypes.object,
  sidebarConfigData: PropTypes.object,
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
  props({ data: { loading, allItems, fetchMore, _allItemsMeta, allSidebarItemses }, ownProps: { filtersSelected } }) {
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
    console.log(allSidebarItemses);
    return {
      loading,
      allItems,
      _allItemsMeta,
      sidebarConfigData: dataToConfig(allSidebarItemses),
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

const dataToConfig = data => {
  if (data) {
    let config = {
      order: [],
      sidebarItems: {},
      filters: {},
      dependencies: {},
      filtersSelected: {}
    };
    data.forEach(item => {
      config.order[item.order] = item.id;
      let filtersOrder = [];
      config.dependencies[item.id] = {
        childs: arrayToObject(item.childs),
        parents: arrayToObject(item.parents)
      };
      config.filtersSelected[item.id] = {};
      item.sidebarFilterses.forEach(filter => {
        config.filters[filter.id] = {
          property: filter.property.id,
          name: filter.name,
          dependentOn: arrayToObject(filter.dependentOn)
        };
        filtersOrder[filter.order] = filter.id;
      });
      config.sidebarItems[item.id] = {
        type: item.type,
        name: item.name,
        multiselection: item.multiselection,
        filtersOrder
      };
    });
    return config;
  }
};

const arrayToObject = (prop) => {
  let result = {};
  prop.forEach(depend => {
    result[depend.id] = true;
  });
  return Object.keys(result).length ? result : false;
};
