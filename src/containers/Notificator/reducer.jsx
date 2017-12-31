/**
 * Created by xax on 23.02.2017.
 */
import { SEND_NOTIFICATION, CLOSE_NOTIFICATION } from './actions/types';

const initialState= {
  type: 'info',
  message: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SEND_NOTIFICATION:
      return { ...state, ...action.payload };
    case CLOSE_NOTIFICATION:
      return initialState;
  }

  return state;
};
