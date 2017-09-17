import React from 'react';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { Paper, Grid } from 'material-ui';
import { connect } from 'react-redux';

import ProductList from '../../components/ProductList';
import { FetchItems, FetchItemsOptions } from './queries/FetchItems';
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
        {sidebarConfigData && <CatalogSidebar config={sidebarConfigData} />}
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
  graphql(FetchItems, FetchItemsOptions)(
  withStyles(styles)(Catalog)
));
