import gql from 'graphql-tag';
import _ from 'lodash';

export const fetchInstances = gql`
  query FetchItems($skippedItems: Int, $first: Int, $filter: InstanceFilter){
    _allInstancesMeta(
        filter: $filter
    ) {
      count
    }
    allInstances(
        first: $first,
        skip: $skippedItems,
        filter: $filter
    ){
      id,
      item{
        img{
          id
          url
        }
      }
    }
  }
`;

export const fetchInstancesOptions = {
  options({ filtersSelected, mapTypes }) {
    const filter = instanceByFilter(filtersSelected, mapTypes);
    return {
      variables: {
        skippedItems: 0,
        first: 24,
        filter
      },
      fetchPolicy: 'network-only',
    };
  },
  props({ data: { loading, allInstances, fetchMore, _allInstancesMeta, allSidebarItems },
          ownProps: { filtersSelected, mapTypes } }) {
    const filter = instanceByFilter(filtersSelected, mapTypes);
    return {
      loading,
      allInstances,
      _allInstancesMeta,
      sidebarConfigData: dataToConfig(allSidebarItems),
      loadMoreItems(page) {
        return fetchMore({
          variables: {
            skippedItems: (page-1)*24,
            first: 24,
            filter
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }
            let allInstances = [];
            previousResult.allInstances.forEach((instance, index) => {
              if (instance) {
                allInstances[index] = instance;
              }
            });
            let i = (page-1) * 24;
            fetchMoreResult.allInstances.forEach(instance => {
              allInstances[i] = instance;
              i++;
            });
            return Object.assign({}, previousResult, { allInstances });
          },
        });
      },
    };
  },
};

const instanceByFilter = (filters, mapType) => {
  let filterResult = {
    AND: []
  };
  let item = {
    AND: []
  };
  let availabilitiesSome = {};
  if (filters) {
    _.forEach(filters, (filter, key) => {
      let type;
      if (mapType) type = _.filter(mapType, o => o.id === key)[0].relation;
      const subfilter = {
        OR: _.map(filter, (value, id) => {
          return {
            sidebarFilters_some: {
              id
            }
          };
        })
      };
      if (type === 'Item' && subfilter.OR.length) {
        item.AND.push(subfilter);
      } else if (type === 'Instance' && subfilter.OR.length) {
        filterResult.AND.push(subfilter);
      } else if (type === 'Availability' && subfilter.OR.length) {
        availabilitiesSome =subfilter;
      } else return null;
    });
  }
  filterResult.AND.push({ item });
  if (availabilitiesSome.OR && availabilitiesSome.OR.length) {
    filterResult.AND.push({ availabilities_some: availabilitiesSome });
  }
  filterResult.AND.push({ valid: true });
  return filterResult;
};

const dataToConfig = data => {
  if (data) {
    let config = {
      order: [],
      sidebarItems: {},
      filters: {},
      dependencies: {},
      filtersSelected: {}
    };
    data.forEach(item => {
      config.order[item.order] = item.id;
      let filtersOrder = [];
      config.dependencies[item.id] = {
        childs: arrayToObject(item.childs),
        parents: arrayToObject(item.parents)
      };
      config.filtersSelected[item.id] = {};
      item.sidebarFilters.forEach(filter => {
        config.filters[filter.id] = {
          property: filter.property.id,
          name: filter.name,
          dependentOn: arrayToObject(filter.dependentOn)
        };
        filtersOrder[filter.order] = filter.id;
      });
      config.sidebarItems[item.id] = {
        type: item.type,
        name: item.name,
        multiselection: item.multiselection,
        filtersOrder
      };
    });
    return config;
  }
};

const arrayToObject = (prop) => {
  let result = {};
  prop.forEach(depend => {
    result[depend.id] = true;
  });
  return Object.keys(result).length ? result : false;
};
