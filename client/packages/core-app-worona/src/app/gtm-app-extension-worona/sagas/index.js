/* eslint-disable no-undef */
import { takeEvery } from 'redux-saga';
import { select, take } from 'redux-saga/effects'
import * as deps from '../deps';

export function launchGTMEventsSaga({ type }) {
  window.dataLayer.push({
    event: type,
  });
}

export default function* gtmSagas() {
  yield take(deps.types.SITE_ID_CHANGED);
  const isPreview = yield select(deps.selectors.getPreview);

  if (!isPreview) {
    window.dataLayer = window.dataLayer || [];
    yield takeEvery('*', launchGTMEventsSaga);
  }
}
