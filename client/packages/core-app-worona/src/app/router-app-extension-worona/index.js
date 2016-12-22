import * as reducers from './reducers';
import * as routes from './routes';
import * as libs from './libs';
import * as types from './types';
import * as selectors from './selectors';
import * as sagas from './sagas';
import * as deps from './deps';

export const name = 'router-app-extension-worona';
export const namespace = 'router';

export {
  libs,
  routes,
  reducers,
  types,
  selectors,
  sagas,
  deps,
};
