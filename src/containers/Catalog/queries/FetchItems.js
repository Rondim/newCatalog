import gql from 'graphql-tag';
import _ from 'lodash';

export const FetchItems = gql`
  query FetchItems($skippedItems: Int, $first: Int, $filter: ItemFilter){
    _allItemsMeta(
        filter: $filter
    ) {
      count
    }
    allItems(
        first: $first,
        skip: $skippedItems,
        filter: $filter
    ){
      id,
      img{
        id
        url
      }
    }
    allSidebarItems {
      id
      name
      order
      type
      multiselection
      childs{
        id
      }
      parents{
        id
      }
      sidebarFilters{
        id
        name
        order
        property{
          id
        }
        dependentOn{
          id
        }
      }
    }
  }
`;

export const FetchItemsOptions = {
  options({ filtersSelected }) {
    let filter = {
      AND: []
    };
    if (filtersSelected) {
      filter.AND = _.map(filtersSelected, firstFilter => {
        return {
          OR: _.map(firstFilter, (value, id) => {
            return {
              sidebarFilters_some: {
                id
              }
            };
          })
        };
      });
    }
    return {
      variables: {
        skippedItems: 0,
        first: 8,
        filter
      },
      fetchPolicy: 'network-only',
    };
  },
  props({ data: { loading, allItems, fetchMore, _allItemsMeta, allSidebarItems }, ownProps: { filtersSelected } }) {
    let filter = {
      AND: []
    };
    if (filtersSelected) {
      filter.AND = _.map(filtersSelected, firstFilter => {
        return {
          OR: _.map(firstFilter, (value, id) => {
            return {
              sidebarFilters_some: {
                id
              }
            };
          })
        };
      });
    }
    return {
      loading,
      allItems,
      _allItemsMeta,
      sidebarConfigData: dataToConfig(allSidebarItems),
      loadMoreItems(page) {
        return fetchMore({
          variables: {
            skippedItems: (page-1)*8,
            first: 8,
            filter
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }
            // let allItems = [...previousResult.allItems];
            let allItems = [];
            previousResult.allItems.forEach((item, index) => {
              if (item) {
                allItems[index] = item;
              }
            });
            let i = (page-1) * 8;
            fetchMoreResult.allItems.forEach(item => {
              allItems[i] = item;
              i++;
            });
            return Object.assign({}, previousResult, { allItems });
          },
        });
      },
    };
  },
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
