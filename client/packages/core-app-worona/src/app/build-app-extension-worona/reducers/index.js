import { combineReducers } from 'redux';
import assets from './assets';
import packages from './packages';

const log = (state, action) => console.log(action);

export default () => combineReducers({
  packages,
  assets,
  // log,
});
