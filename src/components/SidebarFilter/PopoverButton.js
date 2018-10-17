import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import styles from './styles';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { Row } from 'reactstrap';

class PopoverButton extends Component {
  onClick = () => {
    this.props.onClick(this.props.filter.filterId);
  };

  render() {
    const { filter: { filterName, filterColor, selection }, classes } = this.props;
    // Сделать лучше switch
    const buttonStyle = selection === 'selected' ?
      classes.buttonSelected : selection === 'selectedNotByAll' ?
        classes.buttonSelectedNotByAll : classes.buttonNotSelected;
    return (
      <Row style={{ width: '80%', margin: 'auto' }}>
        <Button
          key='button'
          disableRipple
          className={`${buttonStyle} col`}
          onClick={this.onClick}
        >
          {filterName}
        </Button>
        {filterColor && <div
          key='color'
          className='col-xs-1'
          style={{ backgroundColor: filterColor, width: '20px', height: '20px', display: 'inline-block' }}
        />}
      </Row>
    );
  }
}

PopoverButton.propTypes = {
  filter: PropTypes.shape({
    filterId: PropTypes.string.isRequired,
    filterName: PropTypes.string.isRequired,
    selection: PropTypes.string.isRequired,
  }),
  onClick: PropTypes.func.isRequired,
  // from withStyles
  classes: PropTypes.object.isRequired
};

export default compose(
  withStyles(styles),
  pure
)(PopoverButton);
