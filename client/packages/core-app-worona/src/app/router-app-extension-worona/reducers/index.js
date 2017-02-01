import { routerStateReducer } from 'redux-router';
import * as types from '../types';

export default () => (state = { historyLength: 0 }, action) => {
  switch (action.type) {
    case types.SITE_ID_CHANGED:
      return { ...state, siteId: action.siteId, ...routerStateReducer(state, action) };
    case types.IS_PREVIEW:
      return { ...state, preview: true, ...routerStateReducer(state, action) };
    case types.ROUTER_DID_CHANGE:
      return {
        ...state,
        ...routerStateReducer(state, action),
        historyLength: state.historyLength + 1,
      };
    default:
      return { ...state, ...routerStateReducer(state, action) };
  }
};
