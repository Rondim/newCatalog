import React from 'react';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { Paper, Grid } from 'material-ui';

import ProductList from '../../components/ProductList';
import { fetchInstances, fetchInstancesOptions } from './queries/fetchInstances';


const styles = theme => ({
  root: {
    margin: [0, 'auto'],
    width: '80%',
  },
  paper: {
    textAlign: 'center'
  }
});

const CatalogProductList = ({ loading, allInstances, loadMoreItems, _allInstancesMeta, classes }) => (
    <Grid item xs={9}>
      <Paper className={classes.paper}>
        <ProductList
          count={(_allInstancesMeta && _allInstancesMeta.count) || 0}
          instances={loading ? [] : allInstances }
          fetchMore={loadMoreItems}
        />
      </Paper>
    </Grid>
);

CatalogProductList.propTypes = {
  loading: PropTypes.bool,
  allInstances: PropTypes.array,
  loadMoreItems: PropTypes.func,
  _allInstancesMeta: PropTypes.object,
  classes: PropTypes.object.isRequired
};

export default graphql(fetchInstances, fetchInstancesOptions)(withStyles(styles)(CatalogProductList));
