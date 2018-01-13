import { CLOSE_POPUP, OPEN_POPUP } from './actions/types';

const initialState = {
  confirmation: false,
  denial: false,
  isOpen: false,
  header: '',
  body: '',
  denialName: '',
  confirmationName: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case OPEN_POPUP:
      return { ...state, isOpen: true, ...action.payload };
    case CLOSE_POPUP:
      return initialState;
  }
  return state;
};
