import React from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';

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
  const classes = props.classes;

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


export default withStyles(styles)(Catalog);
