import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TabContent, TabPane, Nav, NavItem, NavLink, Button, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { Paper } from 'material-ui';
import _ from 'lodash';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faRedo, faExpand, faTimes } from '@fortawesome/fontawesome-free-solid';
import { faClone } from '@fortawesome/fontawesome-free-regular';

import CatalogSidebar from '../CatalogSidebar';
import SetterSidebar from '../SetterSidebar';
import { fetchConfig, dataToConfig, dataToConfigWithPads } from '../Catalog/queries/fetchConfig';
import fetchFilters from './queries/fetchFilters.graphql';
import { instanceByFilter } from './queries/utils/fetchInstancesCount';
import setFilter from './mutations/setFilter.graphql';
import unsetFilter from './mutations/unsetFilter.graphql';
import createFilter from './mutations/createFilter.graphql';
import Loading from '../../components/Loading';
import CountInstancesForLoad from './CountInstancesForLoad';
import { instanceSelect, disableSidebar } from '../SetterSidebar/actions';
import query from './queries/fetchCells.graphql';
import refreshAllZones from './mutations/refreshAllZones.graphql';
import PadEditor from './PadEditor';
import UniqueEditor from './UniqueEditor';

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
    filtersSelectedCatalog: state.catalogSidebar.filtersSelected
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
@connect(mapStateToProps, { instanceSelect, disableSidebar })
@compose(
  graphql(fetchFilters, {
    name: 'filters',
    options: ({ selectedCells }) => {
      const variables = calcFilterVariables(selectedCells);
      return { variables, fetchPolicy: 'network-only' };
    },
    cachePolicy: { query: true, data: false }
  }),
  graphql(fetchConfig, {
    name: 'config',
    props({ config: { loading, allSidebarItems, allPads } }) {
      return {
        config: {
          loading,
          sidebarConfigData: dataToConfig(allSidebarItems),
          sidebarConfigDataWithPads: dataToConfigWithPads(allSidebarItems, allPads)
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
    /* filters: PropTypes.shape({
      loading: PropTypes.bool,
      filtersByInstanceIds: PropTypes.object
    }),*/
    filters: PropTypes.object,
    setFilter: PropTypes.func,
    unsetFilter: PropTypes.func,
    refreshAllZones: PropTypes.func,
    mode: PropTypes.string,
    changeMode: PropTypes.func,
    onLoad: PropTypes.func,
    instanceSelect: PropTypes.func,
    disableSidebar: PropTypes.func,
    createFilter: PropTypes.func,
    sheet: PropTypes.string,
    filtersSelectedCatalog: PropTypes.object,
    classes: PropTypes.object,
    selectedCells: PropTypes.array,
    selectedGroupCells: PropTypes.object
  };
  static defaultProps = {};

  state={
    redo: false,
    expand: false
  };

  toggle = tab => {
    const { mode, changeMode } = this.props;
    if (mode !== tab) {
      changeMode(tab);
    }
  };

  componentWillReceiveProps(nextProps, nextContext) {
    const { mode, filters: { loading, filtersByInstanceIds }, selectedCells,
      config: { sidebarConfigData, loading: configLoading }, instanceSelect, disableSidebar } = nextProps;
    if (mode === 'setter' && !loading && !configLoading) {
      let selectedInstances = [];
      selectedCells.forEach(({ instId }) => {
        instId && selectedInstances.push(instId);
      });
      if (selectedInstances.length === 0) {
        disableSidebar();
      } else {
        instanceSelect(filtersByInstanceIds, sidebarConfigData);
      }
    }
  }

  filterSet = async ({ filterGroupId, filterId }) => {
    const { selectedCells,
      filters: { filtersByInstanceIds: { someFilters } },
      setFilter, unsetFilter, sheet } = this.props;
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
    const { filtersSelectedCatalog, onLoad, config: { sidebarConfigDataWithPads } } = this.props;
    const filters = instanceByFilter(filtersSelectedCatalog, sidebarConfigDataWithPads.mapTypes);
    onLoad(filters);
  };

  render() {
    const { config: { sidebarConfigData, sidebarConfigDataWithPads, loading }, filtersSelectedCatalog, classes, mode,
      selectedGroupCells, sheet, filters: { loading: fLoading } } = this.props;
    if (loading) return <Loading />;
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: mode === 'loader' })}
              onClick={() => this.toggle('loader')}
            >
              <FontAwesomeIcon
                icon={faRedo}
                size="lg"
                spin={this.state.redo}
                onMouseOver={() => this.setState({ redo: true })}
                onMouseLeave={() => this.setState({ redo: false })}
              />
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: mode === 'padCreator' })}
              onClick={() => this.toggle('padCreator')}
            >
              <FontAwesomeIcon
                icon={faExpand}
                size="lg"
                spin={this.state.expand}
                onMouseOver={() => this.setState({ expand: true })}
                onMouseLeave={() => this.setState({ expand: false })}
              />
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: mode === 'uniqueCreator' })}
              onClick={() => this.toggle('uniqueCreator')}
            >
              <FontAwesomeIcon
                icon={faClone}
                size="lg"
              />
              <FontAwesomeIcon
                icon={faTimes}
                size="lg"
                style={{ marginLeft: '-15px' }}
              />
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
              <CatalogSidebar config={sidebarConfigDataWithPads} />
            </Paper>
            <Row>
              <Col>
                <CountInstancesForLoad
                  mapTypes={sidebarConfigDataWithPads.mapTypes}
                  filtersSelected={filtersSelectedCatalog}
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
          <TabPane tabId="padCreator">
            <PadEditor
              cells={selectedGroupCells}
              sheet={sheet}
              classes={classes.paper}
              config={sidebarConfigDataWithPads}
              filters={filtersSelectedCatalog}
            />
          </TabPane>
          <TabPane tabId="uniqueCreator">
            <UniqueEditor
              cells={selectedGroupCells}
              sheet={sheet}
            />
          </TabPane>
          <TabPane tabId="setter">
            <Paper className={classes.paper}>
              <SetterSidebar
                loading={fLoading}
                config={sidebarConfigData}
                filterSet={this.filterSet}
                onCreateFilter={this.handleCreateFilter}
              />
            </Paper>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

export default Toolbar;
