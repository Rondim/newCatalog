import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import Paper from '@material-ui/core/Paper';
import PopoverButton from './PopoverButton';
import AddFilter from './AddFilter';

const Popover = (props) => {
  if (!props.popoverShow) return null;
  const { filters, onClick, classes, onAdd } = props;
  return (
    <Paper className={classes.popover}>
      {filters.map(filter => {
        return <PopoverButton
          key={filter.filterId}
          filter={filter}
          onClick={onClick}
        />;
      })}
      {onAdd &&
      <AddFilter classes={classes} onAdd={onAdd} />
      }
    </Paper>
  );
};

Popover.propTypes = {
  popoverShow: PropTypes.bool,
  filters: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  // from styles
  classes: PropTypes.object.isRequired,
  onAdd: PropTypes.func
};

export default compose(
  withStyles(styles),
  pure
)(Popover);
