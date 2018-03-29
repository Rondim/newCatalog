import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Sidebar from '../../components/Sidebar';
import { initSidebar } from './actions';
import sidebarItemsSelector from './selectors';
import Loading from '../../components/Loading';

const mapStateToProps = (state) => {
  return {
    sidebarItems: sidebarItemsSelector(state.setterSidebar)
  };
};

@connect(mapStateToProps, { initSidebar })
class SetterSidebar extends Component {
  static propTypes = {
    initSidebar: PropTypes.func,
    filterSet: PropTypes.func,
    onCreateFilter: PropTypes.func,
    sidebarItems: PropTypes.array,
    config: PropTypes.object,
    loading: PropTypes.bool
  };

  componentDidMount() {
    console.log('cdm');
    this.props.initSidebar(this.props.config);
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (!_.isEqual(prevProps.config, this.props.config)) {
      this.props.initSidebar(this.props.config);
    }
  }

  handleFilterClick = (filterGroupId, filterId) => {
    this.props.filterSet({ filterGroupId, filterId });
  };

  render() {
    const { sidebarItems, onCreateFilter, loading } = this.props;
    return (
      <div style={{ height: 360 }}>
        <Sidebar
          sidebarItems={sidebarItems}
          handleFilterClick={this.handleFilterClick}
          onCreateFilter={onCreateFilter}
        />
        {loading && <Loading />}
      </div>
    );
  }
}

export default SetterSidebar;
