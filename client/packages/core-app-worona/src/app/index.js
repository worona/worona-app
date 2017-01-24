/* eslint-disable react/prefer-stateless-function, camelcase, no-undef, import/imports-first,
  no-underscore-dangle, global-require, react/jsx-filename-extension */

__webpack_public_path__ = window.publicPath;

import 'worona-polyfills';
import { packageDownloaded, packageActivated } from 'worona-deps';

import * as loading from './loading-app-theme-worona';
import * as build from './build-app-extension-worona';
import * as router from './router-app-extension-worona';
import * as settings from './settings-app-extension-worona';
import * as gtm from './gtm-app-extension-worona';

packageDownloaded(build, 'build-app-extension-worona', 'build');
packageDownloaded(loading, 'loading-app-theme-worona', 'theme');
packageDownloaded(router, 'router-app-extension-worona', 'router');
packageDownloaded(settings, 'settings-app-extension-worona', 'settings');
packageDownloaded(gtm, 'gtm-app-extension-worona', 'gtm');
packageActivated('build-app-extension-worona');
packageActivated('loading-app-theme-worona');
packageActivated('router-app-extension-worona');
packageActivated('settings-app-extension-worona');
packageActivated('gtm-app-extension-worona');

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { store, startSaga } from './build-app-extension-worona/store';
import FastClick from 'fastclick';
import { ReduxRouter } from 'redux-router';

class App extends React.Component {
  render() {
    return (
      <I18nextProvider i18n={build.i18n.default}>
        <Provider store={store}>
          <ReduxRouter routes={router.routes.default(store)} />
        </Provider>
      </I18nextProvider>
    );
  }
}

startSaga('build', build.sagas.default);
startSaga('settings', settings.sagas.default);
startSaga('router', router.sagas.default);
startSaga('gtm', gtm.sagas.default);

if ('ontouchstart' in window) {
  window.addEventListener('load', () => FastClick.attach(document.body));
}

ReactDOM.render(<App />, document.getElementById('root'));
