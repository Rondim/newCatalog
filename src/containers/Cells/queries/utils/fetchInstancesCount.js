import _ from 'lodash-es';

export const fetchCountOptions = {
  options({ filtersSelected, mapTypes }) {
    const filter = instanceByFilter(filtersSelected, mapTypes);
    return {
      variables: {
        filter
      }
    };
  }
};

export const instanceByFilter = (filters, mapType) => {
  let filterResult = {
    AND: [{ valid: true }]
  };
  let item = {
    AND: []
  };
  let availabilitiesSome = {
    AND: []
  };
  if (filters) {
    _.forEach(filters, (filter, key) => {
      let type;
      if (mapType) type = _.filter(mapType, o => o.id === key)[0].relation;
      const subfilter = {
        OR: _.map(filter, (value, id) => {
          return key === 'pad' ? { pads: { id } } : { sidebarFilters_some: { id } };
        })
      };
      if (type === 'Item' && subfilter.OR.length) {
        item.AND.push(subfilter);
      } else if (type === 'Instance' && subfilter.OR.length) {
        filterResult.AND.push(subfilter);
      } else if (type === 'Availability' && subfilter.OR.length) {
        availabilitiesSome.AND.push(subfilter);
      } else return null;
    });
  }
  filterResult.AND.push({ item });
  filterResult.AND.push({ availabilities_some: availabilitiesSome });
  return filterResult;
};
