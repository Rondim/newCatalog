import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FadeLoader } from 'react-spinners';
import { css } from 'react-emotion';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

class Loading extends Component {
  static propTypes = {
    style: PropTypes.object
  };

  render() {
    const { style } = this.props;
    return (
      <div className='d-flex justify-content-center align-items-center sweet-loading' style={style}>
        <FadeLoader
          className={override}
          sizeUnit={'px'}
          size={150}
          color={'#78777d'}
          loading
        />
      </div>
    );
  }
}

export default Loading;
