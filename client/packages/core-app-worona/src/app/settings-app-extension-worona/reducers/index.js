import { combineReducers } from 'redux';
import { findKey } from 'lodash';
import * as types from '../types';

export const collection = (state = {}, action) => {
  switch (action.type) {
    case types.APP_SETTINGS_SUCCEED:
      return { ...state, ...action.settings };
    case types.SETTINGS_UPDATED: {
      const namespace = action.namespace ? action.namespace : findKey(state, (value, key) =>
        value._id === action._id || key === action.namespace);
      return { ...state, [namespace]: { ...action.fields, _id: action._id } };
    }
    default:
      return state;
  }
};

export default () => combineReducers({
  collection,
});
