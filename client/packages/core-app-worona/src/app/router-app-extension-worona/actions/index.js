import * as types from '../types';

export const siteIdChanged = ({ siteId }) => ({ type: types.SITE_ID_CHANGED, siteId });
