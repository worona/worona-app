import { getDevelopmentPackages } from 'worona-deps';
import { combineReducers } from 'redux';
import { map } from 'lodash';
import update from 'react/lib/update';
import * as types from '../types';

const developmentPackages = getDevelopmentPackages();

const defaultList = {
  'build-app-extension-worona': {
    name: 'build-app-extension-worona',
    namespace: 'build',
  },
  'loading-app-theme-worona': {
    name: 'loading-app-theme-worona',
    namespace: 'theme',
  },
  'routing-app-extension-worona': {
    name: 'routing-app-extension-worona',
    namespace: 'routing',
  },
  'settings-app-extension-worona': {
    name: 'settings-app-extension-worona',
    namespace: 'settings',
  },
};

const defaultDownloaded = [
  ...map(developmentPackages, item => item.name),
  'build-app-extension-worona',
  'loading-app-theme-worona',
  'routing-app-extension-worona',
  'settings-app-extension-worona',
];

const defaultActivated = {
  build: 'build-app-extension-worona',
  routing: 'routing-app-extension-worona',
  theme: 'loading-app-theme-worona',
  settings: 'settings-app-theme-worona',
};

export const list = (state = defaultList, action) => {
  switch (action.type) {
    case types.CORE_PACKAGES_SUCCEED:
      return update(state, { $merge: action.pkgs });
    default:
      return state;
  }
};

export const downloaded = (state = defaultDownloaded, action) => {
  switch (action.type) {
    case types.PACKAGE_DOWNLOAD_SUCCEED:
      return [...state, action.pkg.name];
    default:
      return state;
  }
};

export const activated = (state = defaultActivated, { type, pkg }) => {
  switch (type) {
    case types.PACKAGE_ACTIVATION_SUCCEED:
      return update(state, { $merge: { [pkg.namespace]: pkg.name } });
    default:
      return state;
  }
};

export default combineReducers({
  list,
  downloaded,
  activated,
});
