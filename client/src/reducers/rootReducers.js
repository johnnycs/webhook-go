import {combineReducers, createStore} from 'redux';
import {webhook, search} from './reducer';

const rootReducer = combineReducers({
  webhook: webhook,
  search: search
})
export default rootReducer;
