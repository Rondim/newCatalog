import { CLOSE_POPUP, OPEN_POPUP } from './types';

export function openPopup(values) {
  return {
    type: OPEN_POPUP,
    payload: values
  };
}

export function closePopup() {
  return {
    type: CLOSE_POPUP
  };
}
