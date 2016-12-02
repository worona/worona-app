import { combineReducers } from 'redux';
import * as types from '../types';

export const collection = (state = {}, action) => {
  switch (action.type) {
    case types.APP_SETTINGS_SUCCEED:
      return { ...state, ...action.settings };
    default:
      return state;
  }
};

export default () => combineReducers({ collection });
