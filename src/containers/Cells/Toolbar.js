import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TabContent, TabPane, Nav, NavItem, NavLink, Button } from 'reactstrap';
import classnames from 'classnames';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import CatalogSidebar from '../CatalogSidebar';
import { fetchConfig, fetchConfigOptions } from '../Catalog/queries/fetchConfig';
import { availabilityByFilter } from './queries/fetchAvailabilitiesCount';
import Loading from '../../components/Loading';
import CountAvailabilitiesForLoad from './CountAvailabilitiesForLoad';

const mapStateToProps = (state) => {
  return {
    filtersSelected: state.catalogSidebar.filtersSelected
  };
};

@connect(mapStateToProps)
@graphql(fetchConfig, fetchConfigOptions)
class Toolbar extends Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool,
      sidebarConfigData: PropTypes.object
    }),
    onLoad: PropTypes.func,
    filtersSelected: PropTypes.object
  };
  static defaultProps = {};

  state = {
    activeTab: '1'
  };

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  handleClick = () => {
    const { filtersSelected, onLoad, data: { sidebarConfigData } } = this.props;
    const filters = availabilityByFilter(filtersSelected, sidebarConfigData.mapTypes);
    onLoad(filters);
  };

  render() {
    const { data: { sidebarConfigData, loading }, filtersSelected } = this.props;
    if (loading) return <Loading />;
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => this.toggle('1')}
            >
              Loader
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => this.toggle('2')}
            >
              Setter
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <CatalogSidebar config={sidebarConfigData} />
          <TabPane tabId="1">
            <CountAvailabilitiesForLoad
              mapTypes={sidebarConfigData.mapTypes}
              filtersSelected={filtersSelected}
            />
            <Button color='success' onClick={this.handleClick}>Load</Button>
          </TabPane>
          <TabPane tabId="2">
            <Button>Set</Button>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

export default Toolbar;
