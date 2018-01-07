import gql from 'graphql-tag';

export const fetchConfig = gql`
  query {
    allSidebarItems {
      id
      name
      order
      type
      relation  
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
        color
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

export const fetchConfigOptions = {
  props({ data: { loading, allSidebarItems } }) {
    return {
      data: {
        loading,
        sidebarConfigData: dataToConfig(allSidebarItems),
      }
    };
  },
};

export const dataToConfig = data => {
  if (data) {
    let config = {
      order: [],
      sidebarItems: {},
      filters: {},
      dependencies: {},
      filtersSelected: {},
      mapTypes: []
    };
    data.forEach(item => {
      config.mapTypes.push({ id: item.id, relation: item.relation });
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
          color: filter.color,
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
