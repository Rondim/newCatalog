export const calcActive = (obj, i, j, { left, right, top, bottom }) => {
  if (obj) {
    left = obj.j0 === i && obj.i0 <= j && obj.i1 >= j || left;
    right = obj.j1 === i && obj.i0 <= j && obj.i1 >= j || right;
    top = obj.i0 === j && obj.j0 <= i && obj.j1 >= i || top;
    bottom = obj.i1 === j && obj.j0 <= i && obj.j1 >= i || bottom;
  }
  return { left, right, top, bottom };
};

export const calcStyle = (active, activeBorder, activeZoneBoarder, loaderBorder, padBoarder) => {
  if (active || activeBorder) {
    return 'active-';
  } else if (activeZoneBoarder && (loaderBorder || padBoarder)) {
    return 'active-zone-';
  } else if (loaderBorder) {
    return 'loader-';
  } else if (padBoarder) {
    return 'pad-';
  } else {
    return 'defaultCell-';
  }
};

export const checkWebpFeature = (feature, callback) => {
  const kTestImages = {
    lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
    lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
  };
  let img = new global.Image();
  img.onload = () => {
    const result = (img.width > 0) && (img.height > 0);
    callback(feature, result);
  };
  img.onerror = () => {
    callback(feature, false);
  };
  img.src = 'data:image/webp;base64,' + kTestImages[feature];
};

export const getQuantity = (avails) => {
  let sum = 0;
  avails && avails.forEach(({ quantity }) => {
    sum += quantity;
  });
  return sum;
};

export const getTags = avails => {
  let result = [];
  avails && avails.forEach(({ tags }) => {
    result = result.concat(tags);
  });
  return result;
};

export const getDepartments = avails => {
  let result = [];
  avails && avails.forEach(({ department }) => {
    result = result.concat(department.map(({ name }) => name));
  });
  return result;
};

export const getEachCoordOfZone = (i0, j0, i1, j1) => {
  let coords = [];
  for (let i=i0; i <= i1; i++) {
    for (let j=j0; j <= j1; j++) {
      coords.push({ i, j });
    }
  }
  return coords;
};
