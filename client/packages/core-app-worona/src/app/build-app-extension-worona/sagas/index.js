/* eslint-disable no-constant-condition, array-callback-return */
import { takeEvery } from 'redux-saga';
import { put, fork, call, select, join } from 'redux-saga/effects';
import * as actions from '../actions';
import * as types from '../types';
import * as selectors from '../selectors';
import download from './download';
import load from './load';
import assets from './assets';
import { waitFor } from './waitFor';

export function* packageActivationSaga({ pkg }) {
  try {
    // Download phase.
    const downloaded = yield select(selectors.getDownloadedPackages);
    if (downloaded.indexOf(pkg.name) === -1) {
      yield put(actions.packageDownloadRequested({ pkg }));
      yield call(waitFor, pkg.name, types.PACKAGE_DOWNLOAD_SUCCEED, types.PACKAGE_DOWNLOAD_FAILED);
    }
    // Deactivation of previous package phase.
    const activated = yield select(selectors.getActivatedPackages);
    const previousPackageName = activated[pkg.namespace];
    if (previousPackageName === pkg.name) {
      // The same package is already activated.
      yield put(actions.packageActivationFailed({ error: 'Package already activated.', pkg }));
    } else {
      if (previousPackageName) {
        // A previous package with the same namespace is activated.
        const waitForDeactivation = yield fork(waitFor, previousPackageName,
          types.PACKAGE_DEACTIVATION_SUCCEED, types.PACKAGE_DEACTIVATION_FAILED);
        yield put(actions.packageDeactivationRequested(
          { pkg: { name: previousPackageName, namespace: pkg.namespace } }));
        yield join(waitForDeactivation);
      }
      // Load phase.
      yield put(actions.packageLoadRequested({ pkg }));
      yield call(waitFor, pkg.name, types.PACKAGE_LOAD_SUCCEED, types.PACKAGE_LOAD_FAILED);
      yield put(actions.packageActivationSucceed({ pkg }));
    }
  } catch (error) {
    yield put(actions.packageActivationFailed({ error, pkg }));
  }
}

export default function* sagas() {
  yield [
    fork(download),
    fork(load),
    fork(assets),
    takeEvery(types.PACKAGE_ACTIVATION_REQUESTED, packageActivationSaga),
  ];
}
