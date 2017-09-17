import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import _ from 'lodash';

import query from './queries/FetchSidebarConfigData';

class SidebarConfig extends Component {
  static propTypes = {
    data: PropTypes.shape({
      allSidebarItemses: PropTypes.array,
      loading: PropTypes.bool
    })
  };
  static defaultProps = {};

  render() {
    const { allSidebarItemses, loading } = this.props.data;
    if (!loading) {
      let data = {
        order: [],
        sidebarItems: {},
        filters: {},
        dependencies: {},
        filtersSelected: {}
      };
      allSidebarItemses.forEach(item => {
        data.order[item.order] = item.id;
        let filtersOrder = [];
        data.dependencies[item.id] = {
          childs: arrayToObject(item.childs),
          parents: arrayToObject(item.parents)
        };
        data.filtersSelected[item.id] = {};
        item.sidebarFilterses.forEach( filter => {
          data.filters[filter.id] = {
            property: filter.property.id,
            name: filter.name,
            dependentOn: arrayToObject(filter.dependentOn)
          };
          filtersOrder[filter.order] = filter.id;
        });
        data.sidebarItems[item.id] = {
          type: item.type,
          name: item.name,
          multiselection: item.multiselection,
          filtersOrder
        };
      });
      console.log(data);
    }
    return (
      <div />
    );
  }
}

const arrayToObject = (prop) => {
  let result = {};
  prop.forEach(depend => {
    result[depend.id] = true;
  });
  return Object.keys(result).length ? result : false;
};

export default graphql(query)(SidebarConfig);
