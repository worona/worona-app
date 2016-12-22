/* eslint-disable global-require */
/* global window */
import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { isTest } from 'worona-deps';
import { reduxReactRouter } from 'redux-router';
import { composeWithDevTools } from 'redux-devtools-extension';
import build from '../reducers';
import settings from '../../settings-app-extension-worona/reducers';
import router from '../../router-app-extension-worona/reducers';

const sagaMiddleware = createSagaMiddleware();

const reducers = { build: build(), router: router(), settings: settings() };
const sagas = {};

const composeEnhancers = composeWithDevTools({
  serializeState: false,
});

export const store = createStore(
  combineReducers(reducers),
  composeEnhancers(
    reduxReactRouter({
      createHistory: !isTest ? require('history').createHistory : require('history').createMemoryHistory,
    }),
    applyMiddleware(sagaMiddleware),
  )
);

export default store;

export const dispatch = action => store.dispatch(action);
export const reloadReducers = () => store.replaceReducer(combineReducers(reducers));
export const addReducer = (namespace, reducer) => { if (reducer) reducers[namespace] = reducer; };
export const removeReducer = (namespce) => { if (reducers[namespce]) delete reducers[namespce]; };
export const startSaga = (namespace, saga) => { sagas[namespace] = sagaMiddleware.run(saga); };
export const stopSaga = (namespace) => { if (sagas[namespace]) sagas[namespace].cancel(); };
export const getState = store.getState.bind(store);
export const history = store.history;
