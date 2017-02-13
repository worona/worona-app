/* eslint-disable no-undef */
import { takeEvery } from 'redux-saga';
import { select, take } from 'redux-saga/effects'
import * as deps from '../deps';

export function launchGTMEventsSaga({ type, ...props }) {
  window.dataLayer.push({
    event: type,
    props,
  });
}

export function* virtualPageView() {
  const pathname = yield select(deps.selectors.getPathname);
  const titleFromUrl = capitalize(/\/?([^/]+)/.exec(pathname)[1]).replace(/-/g, ' ');
  const title = !service ? titleFromUrl : titleFromPkg;
  const url = pathname.replace(/(\/?.+)(\/[a-zA-Z0-9]{17})/, '$1');
  window.dataLayer.push({
    event: 'virtualPageView',
    virtualPage: {
      title,
      url,
    },
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
