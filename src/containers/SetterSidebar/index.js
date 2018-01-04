import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Sidebar from '../../components/Sidebar';
import { initSidebar } from './actions';
import sidebarItemsSelector from './selectors';

const mapStateToProps = (state) => {
  return {
    sidebarItems: sidebarItemsSelector(state.catalogSidebar)
  };
};

@connect(mapStateToProps, { initSidebar })
class SetterSidebar extends Component {
  static propTypes = {
    initSidebar: PropTypes.func,
    filterSet: PropTypes.func,
    sidebarItems: PropTypes.array,
    config: PropTypes.object
  };

  componentDidMount() {
    this.props.initSidebar(this.props.config);
  }

  handleFilterClick = (filterGroupId, filterId) => {
    this.props.filterSet({ filterGroupId, filterId });
  };

  render() {
    const { sidebarItems } = this.props;
    return <Sidebar
      sidebarItems={sidebarItems}
      handleFilterClick={this.handleFilterClick}
    />;
  }
}

export default SetterSidebar;
