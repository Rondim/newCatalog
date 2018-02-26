export const calcActive = (obj, i, j, { left, right, top, bottom }) => {
  if (obj) {
    left = obj.j0 === i && obj.i0 <= j && obj.i1 >= j || left;
    right = obj.j1 === i && obj.i0 <= j && obj.i1 >= j || right;
    top = obj.i0 === j && obj.j0 <= i && obj.j1 >= i || top;
    bottom = obj.i1 === j && obj.j0 <= i && obj.j1 >= i || bottom;
  }
  return { left, right, top, bottom };
};

export const calcStyle = (active, activeBorder, zoneBorder) => {
  if (active || activeBorder && !zoneBorder) {
    return { width: '3px', color: '#5baaff' };
  } else if (activeBorder && zoneBorder) {
    return { width: '3px', color: '#00ff05' };
  } else if (zoneBorder) {
    return { width: '3px', color: '#00ffd3' };
  } else {
    return { width: '1px', color: 'grey' };
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
