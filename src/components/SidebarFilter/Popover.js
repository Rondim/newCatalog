import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import styles from './styles';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import Paper from 'material-ui/Paper';
import PopoverButton from './PopoverButton';

const Popover = (props) => {
  if (!props.popoverShow) return null;
  const { filters, onClick, classes } = props;
  return (
      <Paper className={classes.popover}>
        {filters.map(filter => {
          return <PopoverButton
            key={filter.filterId}
            filter={filter}
            onClick={onClick}
          />;
        })}
      </Paper>
  );
};

Popover.propTypes = {
  popoverShow: PropTypes.bool,
  filters: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  // from styles
  classes: PropTypes.object.isRequired
};

export default compose(
  withStyles(styles),
  pure
)(Popover);
