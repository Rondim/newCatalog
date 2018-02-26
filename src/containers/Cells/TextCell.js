import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

class TextCell extends Component {
  static propTypes = {
    edit: PropTypes.bool,
    text: PropTypes.string,
    changeText: PropTypes.func
  };
  static defaultProps = {};

  onChange = ev => {
    this.props.changeText(ev.target.value);
  };

  render() {
    const { edit, text } = this.props;
    return (
      <div
        onDoubleClick={() => this.setState({ edit: true })}
        style={{ height: '100%', width: '100%', overflowWrap: 'break-word' }}
      >
        {edit ?
        <Input
          type='textarea'
          value={text}
          style={{ height: '100%', width: '100%' }}
          onChange={this.onChange}
          autoFocus
        />:
        text && text}
      </div>
    );
  }
}

export default TextCell;
