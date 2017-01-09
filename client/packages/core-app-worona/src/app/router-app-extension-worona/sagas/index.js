import { takeEvery } from 'redux-saga';
import { put, select } from 'redux-saga/effects';
import * as types from '../types';
import * as actions from '../actions';
import * as selectors from '../selectors';

export function* siteIdChangedSaga(action) {
  const newSiteId = action.payload.location.query.siteId;
  const currentSiteId = yield select(selectors.getSiteId);
  if (newSiteId !== currentSiteId) yield put(actions.siteIdChanged({ siteId: newSiteId }));
}

export function* previewSaga() {
  yield put(actions.isPreview());
}

export default function* routerSagas() {
  yield [
    takeEvery(({ type, payload }) =>
    type === types.ROUTER_DID_CHANGE && payload.location.query.preview === 'true',
    previewSaga),
    takeEvery(({ type, payload }) =>
      type === types.ROUTER_DID_CHANGE && payload.location.query.siteId, siteIdChangedSaga),
  ];
}
