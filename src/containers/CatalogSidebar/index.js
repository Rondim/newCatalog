import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Sidebar from '../../components/Sidebar';
import { filterClick, initSidebar } from './actions';
import sidebarItemsSelector from './selectors';

class CatalogSidebar extends Component {
  static propTypes = {
    initSidebar: PropTypes.func,
    filterClick: PropTypes.func,
    sidebarItems: PropTypes.array
  };

  componentDidMount() {
    this.props.initSidebar();
  }

  handleFilterClick = (filterGroupId, filterId) => {
    this.props.filterClick({ filterGroupId, filterId });
  };

  render() {
    const { sidebarItems } = this.props;
    return <Sidebar
      sidebarItems={sidebarItems}
      handleFilterClick={this.handleFilterClick}
    />;
  }
}

const mapStateToProps = (state) => {
  return {
    sidebarItems: sidebarItemsSelector(state.catalogSidebar)
  };
};

export default connect(mapStateToProps, {
  filterClick,
  initSidebar
})(CatalogSidebar);
