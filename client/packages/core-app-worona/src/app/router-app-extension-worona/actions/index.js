import * as types from '../types';

export const siteIdChanged = ({ siteId }) => ({ type: types.SITE_ID_CHANGED, siteId });
export const userIdChanged = ({ userId }) => ({ type: types.USER_ID_CHANGED, userId });
export const isPreview = () => ({ type: types.IS_PREVIEW });
export const deepUrlVisited = ({ url }) => ({ type: types.DEEP_URL_VISITED, url });
