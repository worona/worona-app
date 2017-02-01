/* eslint-disable no-underscore-dangle, no-undef */
import { takeEvery } from 'redux-saga';
import { put, select, call } from 'redux-saga/effects';
import * as types from '../types';
import * as actions from '../actions';
import * as selectors from '../selectors';

export function* siteIdChangedSaga(action) {
  const newSiteId = action.siteId || action.payload.location.query.siteId;
  const currentSiteId = yield select(selectors.getSiteId);
  if (newSiteId !== currentSiteId) yield put(actions.siteIdChanged({ siteId: newSiteId }));
}

export function* previewSaga() {
  yield put(actions.isPreview());
}

export default function* routerSagas() {
  if (window.__woronaSiteId__) yield call(siteIdChangedSaga, { siteId: window.__woronaSiteId__ });
  yield [
    takeEvery(({ type, payload }) =>
    type === types.ROUTER_DID_CHANGE && payload.location.query.preview === 'true',
    previewSaga),
    takeEvery(({ type, payload }) =>
      type === types.ROUTER_DID_CHANGE && payload.location.query.siteId, siteIdChangedSaga),
  ];
}
