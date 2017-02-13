/* eslint-disable no-unused-vars, no-undef */
import request from 'superagent';
import { takeLatest } from 'redux-saga';
import { put, fork, call, select, take } from 'redux-saga/effects';
import { isDev, getDevelopmentPackages } from 'worona-deps';
import { toArray, pull } from 'lodash';
import { flow, values, concat, map, filter, keyBy, mapValues, uniqBy } from 'lodash/fp';
import * as actions from '../actions';
import * as selectors from '../selectors';
import * as deps from '../deps';

export function* monitorPackageActivations({ pkgs }) {
  const unactivatedPkgs = pkgs.map(pkg => pkg.name);
  while (unactivatedPkgs.length > 0) {
    const { pkg: { name } } = yield take(deps.types.PACKAGE_ACTIVATION_SUCCEED);
    pull(unactivatedPkgs, name);
  }
  yield put(deps.actions.initialPackagesActivated({ pkgs }));
}

export function* retrieveSettings({ siteId }) {
  yield put(actions.appSettingsRequested());
  try {
    // Call the API.
    const env = isDev ? 'dev' : 'prod';
    const cdn = window.loaction.host === 'preapp.worona.org' ? 'precdn' : 'cdn';
    const isPreview = yield select(deps.selectors.getPreview);
    const preview = isPreview ? 'preview' : 'live';
    const res = yield call(
      request.get,
      `https://${cdn}.worona.io/api/v1/settings/site/${siteId}/app/${env}/${preview}`,
    );
    const settings = flow(
      keyBy(setting => setting.woronaInfo.namespace),
      mapValues(setting => {
        const { woronaInfo, ...rest } = setting;
        return rest;
      }),
    )(res.body);
    // Extract the packages info from settings.
    const devPkgs = getDevelopmentPackages();
    const devNamespaces = toArray(devPkgs).map(pkg => pkg.namespace);
    const pkgs = flow(
      values,
      concat(res.body.filter(pkg => devNamespaces.indexOf(pkg.woronaInfo.namespace) === -1)),
      map(setting => ({ ...setting.woronaInfo.app, ...setting.woronaInfo })),
      filter(pkg => pkg.name !== 'site-general-settings-worona'),
    )(devPkgs);
    // Inform that the API call was successful.
    yield put(actions.appSettingsSucceed({ settings, pkgs }));
    // Start activation for each downloaded package.
    yield fork(monitorPackageActivations, { pkgs });
    yield toArray(pkgs).map(pkg => put(deps.actions.packageActivationRequested({ pkg })));
  } catch (error) {
    yield put(actions.appSettingsFailed({ error }));
  }
}

export default function* settingsSagas() {
  yield [ takeLatest(deps.types.SITE_ID_CHANGED, retrieveSettings) ];
}
