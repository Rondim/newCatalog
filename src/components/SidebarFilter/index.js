import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { withStyles } from 'material-ui/styles';
import styles from './styles';
import Button from 'material-ui/Button';
import Popover from './Popover';


class SidebarFilter extends Component {
  state = {
    popoverShow: this.props.defaultShow || false
  };
  onClick = (filterId) => {
    const { filterGroupId } = this.props;
    this.props.handleFilterClick(filterGroupId, filterId);
  };
  onMouseEnter = () => {
    this.setState({ popoverShow: true });
  };
  onMouseLeave = () => {
    this.setState({ popoverShow: false });
  };
  render() {
    const { classes, buttonDisplayText, filters, isActive } = this.props;
    return (
      <div className={classes.root}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <Button
          disableRipple
          className={ classes[buttonDisplayText.className] ? classes[buttonDisplayText.className] :
            isActive ? classes.mainButton : classes.mainButtonDisabled }
        >
          {buttonDisplayText.text}
        </Button>
        <Popover
          popoverShow={isActive && this.state.popoverShow}
          filters={filters}
          onClick={this.onClick}
        />
      </div>
    );
  }
}

SidebarFilter.propTypes = {
  filters: PropTypes.array.isRequired,
  buttonDisplayText: PropTypes.object.isRequired,
  filterGroupId: PropTypes.string.isRequired,
  handleFilterClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
  defaultShow: PropTypes.bool,
  // From withStyles
  classes: PropTypes.object.isRequired
};

export default compose(
  withStyles(styles)
)(SidebarFilter);
