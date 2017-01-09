import { routerStateReducer } from 'redux-router';
import * as types from '../types';

export default () => (state = {}, action) => {
  if (action.type === types.SITE_ID_CHANGED) return { ...state, siteId: action.siteId };
  else if (action.type === types.IS_PREVIEW) return { ...state, preview: true };
  return routerStateReducer(state, action);
};
