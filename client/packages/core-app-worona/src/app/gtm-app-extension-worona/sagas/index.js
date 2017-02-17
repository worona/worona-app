/* eslint-disable no-undef */
import { takeEvery } from 'redux-saga';
import { select, take, fork, call } from 'redux-saga/effects';
import * as deps from '../deps';

export function launchGtmEventsSaga({ type, ...props }) {
  window.dataLayer.push({
    event: type,
    props,
  });
}

export function* virtualPageView() {
  const pathname = yield select(deps.selectors.getPathname);
  const query = yield select(deps.selectors.getURLQueries);
  const siteUrl = yield select(deps.selectorCreators.getSetting('generalSite', 'url'));
  const siteName = yield select(deps.selectorCreators.getSetting('generalSite', 'name'));
  let url = `${siteUrl}${pathname}`;
  let title = `${siteName} - `;
  if (query.p) {
    title += `Post - ${query.p}`;
    url += `?p=${query.p}`;
  } else if (query.cat) {
    title += `Category - ${query.cat}`;
    url += `?cat=${query.cat}`;
  } else if (query.tag) {
    title += `Tag - ${query.tag}`;
    url += `?tag=${query.tag}`;
  } else if (query.author) {
    title += `Author - ${query.author}`;
    url += `?author=${query.author}`;
  } else if (query.y || query.m) {
    title += `Archive - ${query.m}`;
    url += `?m=${query.m}`;
  } else if (query.page_id) {
    title += `Page - ${query.page_id}`;
    url += `?page_id=${query.page_id}`;
  } else if (query.s) {
    title += `Search - ${query.s}`;
    url += `?s=${query.s}`;
  } else if (query.attachment_id) {
    title += `Attachment - ${query.attachment_id}`;
    url += `?attachment_id=${query.attachment_id}`;
  } else {
    title += 'Home';
  }
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
  // const isPreview = yield select(deps.selectors.getPreview);

  window.dataLayer = window.dataLayer || [];
  yield [
    fork(function* firstVirtualPageView() {
      yield take(deps.types.APP_SETTINGS_SUCCEED);
      yield call(virtualPageView);
    }),
    takeEvery('*', launchGtmEventsSaga),
    takeEvery(deps.types.ROUTER_DID_CHANGE, virtualPageView),
  ];
}
