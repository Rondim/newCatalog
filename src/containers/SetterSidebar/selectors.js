import { createSelector } from 'reselect';

export const sidebarItemsSelector = (state) => {
  if (!state.order) return [];
  const { dependencies, filtersSelected, filters } = state;
  return state.order.map(propId => {
    const parents = dependencies[propId]['parents'];
    const { type, name, filtersOrder } = state.sidebarItems[propId];
    const displayFilters = getDisplayFilters(filtersOrder, parents, filtersSelected, propId);
    const buttonDisplayText = getDisplayText(filters, filtersSelected, name, propId);
    const isActive = displayFilters.length > 0;

    return {
      type,
      buttonDisplayText,
      isActive,
      filterGroupId: propId,
      filters: displayFilters
     };
  });

  function getDisplayText(filters, filtersSelected, propName, propId) {
    const selection = filtersSelected[propId];
    const selectedIds = Object.keys(selection).reduce((outArr, filterId) => {
      if (selection[filterId] && selection[filterId] !== 'notSelected') {
        outArr.push(filterId);
      }
      return outArr;
    }, []);
    if (selectedIds.length === 0) return { text: propName };
    let className = '';
    if (selection[Object.keys(selection)[0]] === 'selected') {
      className = 'mainButtonSelected';
    } else if (selection[Object.keys(selection)[0]] === 'selectedNotByAll') {
      className = 'mainButtonSelectedNotByAll';
    }
    if (selectedIds.length === 1) return { text: filters[selectedIds[0]]['name'], className };
    return { text: selectedIds.map(filterId => {
      return filters[filterId]['name'].substr(0, 3);
    }).join(', ').substr(0, 20), className };
  }

  function getDisplayFilters(filtersOrder, parents, filtersSelected, propId) {
    const filteredFilterIds = filtersOrder.filter(filterId => {
      if (!parents) return true;
      const isParentSelected = Object.keys(parents).some(parentProp => {
        return Object.keys(filters[filterId]['dependentOn']).some(parentId => {
          return filtersSelected[parentProp][parentId] === 'selected';
        });
      });
      return isParentSelected;
    });
    return filteredFilterIds.map(filterId => {
      return {
        filterId,
        filterName: filters[filterId]['name'],
        selection: filtersSelected[propId][filterId] || 'notSelected'
      };
    });
  }
};

export default createSelector(sidebarItemsSelector, (sidebarItems) => {
  return sidebarItems;
});
