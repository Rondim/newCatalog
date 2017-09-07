import {
  UNAUTH_USER
} from './types';
export function signoutUser() {
  return dispatch => signoutDispatch(dispatch);
}

export function signoutDispatch(dispatch) {
  localStorage.removeItem('token');
  dispatch({ type: UNAUTH_USER });
}
