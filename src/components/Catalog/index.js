import React from 'react';
import { withStyles } from 'material-ui/styles';
import { Paper, Grid } from 'material-ui';
import PropTypes from 'prop-types';

import ProductList from '../ProductList';
import CatalogSidebar from '../../containers/CatalogSidebar';

const styles = theme => ({
  root: {
    margin: [0, 'auto'],
    width: 1024,
  },
  paper: {
    textAlign: 'center'
  }
});

function Catalog(props) {
  const { classes } = props;

  return (
      <Grid container spacing={8} className={classes.root}>
        <Grid item xs={9}>
          <Paper className={classes.paper}>
            <ProductList />
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <CatalogSidebar />
          </Paper>
        </Grid>
      </Grid>
  );
}

Catalog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Catalog);
