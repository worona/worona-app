/* eslint-disable no-constant-condition, array-callback-return */
import request from 'superagent';
import { isDev, getDevelopmentPackages } from 'worona-deps';
import { takeEvery } from 'redux-saga';
import { put, fork, call, select } from 'redux-saga/effects';
import { toArray } from 'lodash';
import * as actions from '../actions';
import * as types from '../types';
import * as selectors from '../selectors';
import download from './download';
import load from './load';
import assets from './assets';
import { waitFor } from './waitFor';

export function* retrieveSettings() {
  yield put(actions.appSettingsRequested());
  const siteId = yield select(selectors.getSiteId);
  try {
    // Call the API.
    const env = isDev ? 'dev' : 'prod';
    const res = yield call(request.get,
      `https://cdn.worona.io/api/v1/settings/site/${siteId}/app/${env}/live`);
    const settings = res.body;
    // Extract the packages info from settings.
    const devPkgs = getDevelopmentPackages();
    const pkgs = settings.concat(toArray(devPkgs)).map(setting => setting.woronaInfo);
    // Inform that the API call was successful.
    yield put(actions.appSettingsSucceed({ settings, pkgs }));
    // Start activation for each downloaded package.
    yield toArray(pkgs).map(pkg => put(actions.packageActivationRequested({ pkg })));
  } catch (error) {
    yield put(actions.appSettingsFailed());
  }
}

export function* packageActivationSaga({ pkg }) {
  try {
    // Download phase.
    const downloaded = yield select(selectors.getDownloadedPackages);
    if (downloaded.indexOf(pkg.name) === -1) {
      yield put(actions.packageDownloadRequested({ pkg }));
      yield call(waitFor, pkg.name, types.PACKAGE_DOWNLOAD_SUCCEED, types.PACKAGE_DOWNLOAD_FAILED);
    }
    // Deactivation of previous package phase.
    const activated = select(selectors.getActivatedPackages);
    const previousPackage = activated[pkg.namespace];
    if (previousPackage) {
      yield put(actions.packageDeactivationRequested({ previousPackage }));
      yield call(waitFor, previousPackage.name,
        types.PACKAGE_DEACTIVATION_SUCCEED, types.PACKAGE_DEACTIVATION_FAILED);
    }
    // Load phase.
    yield put(actions.packageLoadRequested({ pkg }));
    yield call(waitFor, pkg.name, types.PACKAGE_LOAD_SUCCEED, types.PACKAGE_LOAD_FAILED);
    yield put(actions.packageActivationSucceed({ pkg }));
  } catch (error) {
    yield put(actions.packageActivationFailed({ error: error.message, pkg }));
  }
}

export default function* sagas() {
  yield [
    fork(download),
    fork(load),
    fork(assets),
    takeEvery(types.PACKAGE_ACTIVATION_REQUESTED, packageActivationSaga),
    fork(retrieveSettings),
  ];
}
