import * as actions from './actions';
import * as types from './types';
import * as reducerCreators from './reducerCreators';
import * as reducers from './reducers';
import * as store from './store';
import * as sagas from './sagas';
import * as selectors from './selectors';
import * as i18n from './i18n';

const locales = lang => require(`./locales/${lang}.json`);

export const name = 'build-app-extension-worona';
export const namespace = 'build';

export {
  actions,
  types,
  reducerCreators,
  reducers,
  store,
  sagas,
  selectors,
  locales,
  i18n,
};
