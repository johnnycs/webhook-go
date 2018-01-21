import * as types from '../actions/types';
// import initialState from './initialState';

export function webhook(state = [], action) {
  switch(action.type) {
    case types.LOAD_DATA_SUCCESS:
      return action.data
    case types.CLEAR_DATA:
      return []
    default:
      return state;
  }
}

export function search(state = {}, action) {
  switch (action.type) {
    case types.SET_SEARCH:
      return Object.assign(state, action.data);
    default:
      return state;
  }
}
