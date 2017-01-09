export const getParam = param => state => state.router.params[param];
export const getPathname = state => state.router.location.pathname;
export const getSelectedSiteId = state => state.router.params.siteId;
export const getSelectedService = state => state.router.params.service;
export const getSelectedPackageName = state => state.router.params.packageName;
export const getURLQueries = state => state.router.location.query;

export const getSiteId = state => state.router.siteId;
export const getPreview = state => state.router.preview === true;
