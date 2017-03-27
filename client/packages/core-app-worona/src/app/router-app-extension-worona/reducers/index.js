import { routerStateReducer } from 'redux-router';
import * as types from '../types';

const contentType = action => {
  if (action.payload.location.query.p) return 'Post';
  if (action.payload.location.query.cat) return 'Category';
  if (action.payload.location.query.tag) return 'Tag';
  if (action.payload.location.query.author) return 'Author';
  if (action.payload.location.query.y || action.payload.location.query.m) return 'Archive';
  if (action.payload.location.query.page_id) return 'Page';
  if (action.payload.location.query.s) return 'Search';
  if (action.payload.location.query.attachment_id) return 'Attachment';
  return 'Home';
};

const contentId = action => {
  if (action.payload.location.query.p) return action.payload.location.query.p;
  if (action.payload.location.query.cat) return action.payload.location.query.cat;
  if (action.payload.location.query.tag) return action.payload.location.query.tag;
  if (action.payload.location.query.author) return action.payload.location.query.author;
  if (action.payload.location.query.y || action.payload.location.query.m)
    return { y: action.payload.location.query.y, m: action.payload.location.query.m };
  if (action.payload.location.query.page_id) return action.payload.location.query.page_id;
  if (action.payload.location.query.s) return action.payload.location.query.s;
  if (action.payload.location.query.attachment_id)
    return action.payload.location.query.attachment_id;
  return '';
};

export default () =>
  (state = { historyLength: 0 }, action) => {
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
          contentType: contentType(action),
          contentId: contentId(action),
        };
      default:
        return { ...state, ...routerStateReducer(state, action) };
    }
  };
