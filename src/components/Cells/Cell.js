/**
 * Created by xax on 23.03.2017.
 */
import React from 'react';
import PropTypes from 'prop-types';

const Cell = (props) => {
  const active = props.active ? 'active' : '';
  return (
    <img
      draggable='false'
      src={props.url}
      id={props.id}
      className={'img-responsive img-rounded ' + active} />
  );
};

Cell.propTypes = {
  active: PropTypes.bool,
  url: PropTypes.string,
  id: PropTypes.string
};

export default Cell;
