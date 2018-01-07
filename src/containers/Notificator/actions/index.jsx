import {
  SEND_NOTIFICATION,
  CLOSE_NOTIFICATION
} from './types';

export function sendNotification(dispatch, type, message) {
  dispatch({
    type: SEND_NOTIFICATION,
    payload: { type, message }
  });
  setTimeout(() => dispatch({ type: CLOSE_NOTIFICATION }), 3000);
}

export function notification(type, message) {
  return (dispatch) => sendNotification(dispatch, type, message);
}
