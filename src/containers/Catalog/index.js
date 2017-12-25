import React from 'react';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { Paper, Grid } from 'material-ui';
import { connect } from 'react-redux';

import { fetchConfig, fetchConfigOptions } from './queries/fetchConfig';
import CatalogSidebar from '../CatalogSidebar';
import CatalogProductList from '../CatalogProductList';


const styles = theme => ({
  root: {
    margin: [0, 'auto'],
    width: '80%',
  },
  paper: {
    textAlign: 'center'
  }
});

const Catalog = ({ loading, classes, sidebarConfigData, filtersSelected }) => (
  <Grid container spacing={8} className={classes.root}>
    <CatalogProductList mapTypes={sidebarConfigData && sidebarConfigData.mapTypes} filtersSelected={filtersSelected} />
    <Grid item xs={3}>
      <Paper className={classes.paper}>
        {sidebarConfigData && <CatalogSidebar config={sidebarConfigData} />}
      </Paper>
    </Grid>
  </Grid>
);

Catalog.propTypes = {
  loading: PropTypes.bool,
  filtersSelected: PropTypes.object,
  sidebarConfigData: PropTypes.object,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    filtersSelected: state.catalogSidebar.filtersSelected
  };
};

export default connect(mapStateToProps)(
  graphql(fetchConfig, fetchConfigOptions)(
  withStyles(styles)(Catalog)
));
