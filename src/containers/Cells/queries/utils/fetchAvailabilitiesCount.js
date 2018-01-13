import _ from 'lodash-es';

export const fetchCountOptions = {
  options({ filtersSelected, mapTypes }) {
    const filter = availabilityByFilter(filtersSelected, mapTypes);
    return {
      variables: {
        filter
      }
    };
  }
};

export const availabilityByFilter = (filters, mapType) => {
  let filterResult = {
    AND: []
  };
  let item = {
    AND: []
  };
  let instance = {
    AND: [{ valid: true }]
  };
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
        instance.AND.push(subfilter);
      } else if (type === 'Availability' && subfilter.OR.length) {
        filterResult.AND.push(subfilter);
      } else return null;
    });
  }
  instance.AND.push({ item });
  filterResult.AND.push({ instance });
  return filterResult;
};
