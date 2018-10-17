import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';
import Loading from '../Loading';

const ProductListItem = ({ active, complited, handleSelect, img, id, disabled, loading }) => {
  let activeClass = active && !disabled ? 'active' : '';
  const complitedClass = complited ? 'complited' : '';
  activeClass = !disabled && !active && !complited ? 'bad' : activeClass;
  return (
    <Col className={`product_item ${complitedClass} ${activeClass}`}>
      {!loading ? <a href="#" onClick={handleSelect}>
        <img src={img} id={id} width='80px' />
      </a> : <Loading />}
    </Col>
  );
};
ProductListItem.propTypes = {
  active: PropTypes.bool,
  complited: PropTypes.bool,
  img: PropTypes.string.isRequired,
  handleSelect: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  loading: PropTypes.bool
};

export default ProductListItem;
