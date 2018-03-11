import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TabContent, TabPane, Nav, NavItem, NavLink, Button, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { Paper } from 'material-ui';
import _ from 'lodash';

import CatalogSidebar from '../CatalogSidebar';
import SetterSidebar from '../SetterSidebar';
import { fetchConfig, dataToConfig } from '../Catalog/queries/fetchConfig';
import fetchFilters from './queries/fetchFilters.graphql';
import { instanceByFilter } from './queries/utils/fetchInstancesCount';
import setFilter from './mutations/setFilter.graphql';
import unsetFilter from './mutations/unsetFilter.graphql';
import createFilter from './mutations/createFilter.graphql';
import Loading from '../../components/Loading';
import CountInstancesForLoad from './CountInstancesForLoad';
import { instanceSelect } from '../CatalogSidebar/actions';
import query from './queries/fetchCells.graphql';
import refreshAllZones from './mutations/refreshAllZones.graphql';

const styles = theme => ({
  root: {
    margin: [0, 'auto'],
    width: '80%',
  },
  paper: {
    textAlign: 'center'
  }
});

const mapStateToProps = (state) => {
  return {
    filtersSelected: state.catalogSidebar.filtersSelected
  };
};

const calcFilterVariables = (selectedCells) => {
  let instIds = [];
  let instancesEvery = [];
  let itemsEvery = [];
  selectedCells && selectedCells.forEach(({ instId }) => {
    if (instId) {
      instIds.push(instId);
      instancesEvery.push({ instances_some: { id: { instId } } });
      itemsEvery.push({ items_some: { instances_some: { id: instId } } });
    }
  });
  return { instIds, instancesEvery, itemsEvery };
};

@withStyles(styles)
@connect(mapStateToProps, { instanceSelect })
@compose(
  graphql(fetchFilters, {
    name: 'filters',
    options: ({ selectedCells }) => {
      const variables = calcFilterVariables(selectedCells);
      return { variables, fetchPolicy: 'network-only' };
    }
  }),
  graphql(fetchConfig, {
    name: 'config',
    props({ config: { loading, allSidebarItems } }) {
      return {
        config: {
          loading,
          sidebarConfigData: dataToConfig(allSidebarItems),
        }
      };
    }
  })
)
  @compose(
    graphql(refreshAllZones, { name: 'refreshAllZones' }),
    graphql(setFilter, { name: 'setFilter' }),
    graphql(unsetFilter, { name: 'unsetFilter' }),
    graphql(createFilter, { name: 'createFilter' })
  )
class Toolbar extends Component {
  static propTypes = {
    config: PropTypes.shape({
      loading: PropTypes.bool,
      sidebarConfigData: PropTypes.object
    }),
    filters: PropTypes.shape({
      loading: PropTypes.bool,
      someFilters: PropTypes.array,
      everyFilters: PropTypes.array
    }),
    setFilter: PropTypes.func,
    unsetFilter: PropTypes.func,
    refreshAllZones: PropTypes.func,
    mode: PropTypes.string,
    changeMode: PropTypes.func,
    onLoad: PropTypes.func,
    instanceSelect: PropTypes.func,
    createFilter: PropTypes.func,
    sheet: PropTypes.string,
    filtersSelected: PropTypes.object,
    classes: PropTypes.object,
    selectedCells: PropTypes.array
  };
  static defaultProps = {};

  toggle = tab => {
    const { mode, changeMode } = this.props;
    if (mode !== tab) {
      changeMode(tab);
    }
  };

  componentWillReceiveProps(nextProps, nextContext) {
    const { mode, filters: { loading, filtersByInstanceIds }, selectedCells,
      config: { sidebarConfigData, loading: configLoading }, filters, instanceSelect } = nextProps;
    if (mode === 'setter' && !loading && !configLoading && selectedCells && _.get(selectedCells, '[0].instId')) {
      if ( !_.isEqual(filters, this.props.filters)) {
        instanceSelect(filtersByInstanceIds, sidebarConfigData);
      }
    }

    if (this.props.mode === 'setter' && mode === 'loader') {
      instanceSelect({ someFilters: [], everyFilters: [] }, sidebarConfigData);
    }
  }

  filterSet = async ({ filterGroupId, filterId }) => {
    const { selectedCells,
      filters: { filtersByInstanceIds: { someFilters } },
      setFilter, unsetFilter, sheet } = this.props;
    console.log('filterSet');
    let needUncheck;
    const ids = selectedCells.map(({ instId }) => instId);
    const variables = calcFilterVariables(selectedCells);
    const options = (ids) => {
      return {
        variables: { filterId, ids },
        refetchQueries: [{
          query: fetchFilters,
          variables
        }, {
          query,
          variables: { sheet }
        }]
      };
    };
    if (_.find(someFilters, o => o.id === filterId && o.property.id === filterGroupId)) {
      await unsetFilter(options(ids));
    } else if ((needUncheck = _.filter(someFilters, o => o.property.id === filterGroupId)).length &&
      filterGroupId !== 'cjc047oph4wps01966w0ux0xn') {
      // снятие фильтра если нет мультиселекта и выставление нового
      await Promise.all(needUncheck.map(({ id: filterId }) => {
        unsetFilter({ variables: { filterId, ids } });
      }));
      await setFilter(options(ids));
    } else {
      return setFilter(options(ids));
    }
  };

  refreshAll = () => {
    const { sheet, refreshAllZones } = this.props;
    refreshAllZones({ variables: { sheetId: sheet } });
  };

  handleCreateFilter = (name, color, propertyId, order) => {
    this.props.createFilter({ variables: { name, propertyId, order, color },
      refetchQueries: [{
        query: fetchConfig
      }]
    });
  };

  handleClick = () => {
    const { filtersSelected, onLoad, config: { sidebarConfigData } } = this.props;
    const filters = instanceByFilter(filtersSelected, sidebarConfigData.mapTypes);
    onLoad(filters);
  };

  render() {
    const { config: { sidebarConfigData, loading }, filtersSelected, classes, mode,
      filters: { loading: fLoading } } = this.props;
    if (loading) return <Loading />;
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: mode === 'loader' })}
              onClick={() => this.toggle('loader')}
            >
              Loader
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: mode === 'setter' })}
              onClick={() => this.toggle('setter')}
            >
              Setter
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={mode}>
          <TabPane tabId="loader">
            <Paper className={classes.paper}>
              <CatalogSidebar config={sidebarConfigData} />
            </Paper>
            <Row>
              <Col>
                <CountInstancesForLoad
                  mapTypes={sidebarConfigData.mapTypes}
                  filtersSelected={filtersSelected}
                />
              </Col>
              <Col>
                <Button color='success' onClick={this.handleClick}>Load</Button>
              </Col>
            </Row>
            <Row><Col>
              <Button color='success' onClick={this.refreshAll}>Refresh all zones</Button>
            </Col></Row>
          </TabPane>
          <TabPane tabId="setter">
            <Paper className={classes.paper}>
              { fLoading && mode === 'setter' ? <Loading /> :
                <SetterSidebar
                  config={sidebarConfigData}
                  filterSet={this.filterSet}
                  onCreateFilter={this.handleCreateFilter} />}
            </Paper>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

export default Toolbar;
