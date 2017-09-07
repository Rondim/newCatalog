import { sidebarItemsSelector } from '../selectors';
import { sidebarConfigData as sidebarState } from '../fixtures';

beforeEach(() => {
  const filtersSelectedResetted = {};
  sidebarState.order.forEach((property) => {
    filtersSelectedResetted[property] = {};
  });
  sidebarState.filtersSelected = filtersSelectedResetted;
  sidebarState.dependencies = {
    Manufacturer: {
      childs: false,
      parents: false
    },
    ItemType: {
        childs: { ItemSubtype: true, Size: true },
        parents: false
    },
    ItemSubtype: {
      childs: false,
      parents: { ItemType: true }
    },
    Size: {
      childs: false,
      parents: { ItemType: true }
    }
  };
});

test('filtersSelected successfully resetted', () => {
  expect(sidebarState.filtersSelected).toEqual({
    Manufacturer: {},
    ItemType: {},
    ItemSubtype: {},
    Size: {}
  });
});

test('correct sidebarProps with no selection', () => {
  const result = sidebarItemsSelector(sidebarState);
  expect(result[1].type).toBe('filter');
  expect(result[1].buttonDisplayText).toBe('Тип Изделия');
  expect(result[1].filterGroupId).toBe('ItemType');
  expect(result[1].filters.length).toBe(2);
  expect(result[1].filters.every(filter => {
    return filter.selection === 'notSelected';
  })).toBe(true);
  expect(result[2].filters.length).toBe(0);
  expect(result[2].isActive).toBe(false);
  expect(result[3].filters.length).toBe(0);
  expect(result[3].isActive).toBe(false);
});

test('when ItemType selected', () => {
  sidebarState.filtersSelected = {
    ...sidebarState.filtersSelected,
    ItemType: {
      rings: 'selected'
    }
  };
  const result = sidebarItemsSelector(sidebarState);
  expect(result[1].filters[1].selection).toBe('selected');
  expect(result[1].buttonDisplayText).toBe('Кольца');
  expect(result[2].filters.length).toBe(2);
  expect(result[2].isActive).toBe(true);
  expect(result[3].filters.length).toBe(2);
});


describe('cascade dependency', () => {
  beforeEach(() => {
    sidebarState.dependencies = {
      ...sidebarState.dependencies,
      ItemType: {
        childs: { ItemSubtype: true },
        parents: false
      },
      ItemSubtype: {
        childs: { Size: true },
        parents: { ItemType: true }
      },
      Size: {
        childs: false,
        parents: { ItemSubtype: true }
      }
    };
    sidebarState.filtersSelected = {
      ...sidebarState.filtersSelected,
      ItemType: {
        rings: 'selected'
      }
    };
  });
  test('when cascade dependency, one selected', () => {
    const result = sidebarItemsSelector(sidebarState);
    expect(result[2].filters.length).toBe(2);
    expect(result[3].filters.length).toBe(0);
  });
  test('when cascade dependency, two selected', () => {
    sidebarState.filtersSelected = {
      ...sidebarState.filtersSelected,
      ItemSubtype: {
        wedding: 'selected'
      }
    };
    sidebarState.filters['s16'] = {
      property: 'Size',
      name: '16',
      dependentOn: { wedding: true }
    };
    sidebarState.filters['s16_5'] = {
      property: 'Size',
      name: '16.5',
      dependentOn: { wedding: true }
    };
    const result = sidebarItemsSelector(sidebarState);
    expect(result[2].filters.length).toBe(2);
    expect(result[3].filters.length).toBe(2);
  });
});
