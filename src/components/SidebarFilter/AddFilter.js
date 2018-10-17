import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/fontawesome-free-solid';
import Button from '@material-ui/core/Button';
import { Input } from 'reactstrap';
import { CirclePicker } from 'react-color';

class AddFilter extends Component {
  static propTypes = {
    onAdd: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
  };
  static defaultProps = {};

  state={
    addName: false,
    addColor: false,
    name: '',
  };

  handleSubmit = color => {
    const { name } = this.state;
    this.props.onAdd(name, color.hex);
    this.setState({ addColor: false, name: '' });
  };

  handleSubmitName = (ev) => {
    if (ev.keyCode === 13) {
      this.setState({ addName: false, addColor: true });
    }
  };

  changeName = (ev) => {
    this.setState({ name: ev.target.value });
  };

  onClickPlus = (ev) => {
    ev.preventDefault();
    this.setState({ addName: true });
  };

  render() {
    const { addName, addColor } = this.state;
    const { classes } = this.props;
    if (!addName && !addColor) {
      return (
        <Button
          disableRipple
          className={classes.buttonNotSelected}
          onClick={this.onClickPlus}
        >
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      );
    } else if (!addColor) {
      return (
        <Input
          value={this.state.name}
          onChange={this.changeName}
          onKeyDown={this.handleSubmitName}
          autoFocus
        />
      );
    } else {
      return (
        <CirclePicker
          circleSpacing={7}
          onChangeComplete={ this.handleSubmit }
          width={174}
          circleSize={21}
        />
      );
    }
  }
}

export default AddFilter;
