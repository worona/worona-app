import { find } from 'lodash';

export const getSettings = namespace => state => state.settings.collection[namespace];

export const getSetting = (namespace, setting) => state =>
state.settings.collection[namespace][setting];

export const getSettingById = _id => state => find(state.settings.collection, it => it._id === _id);
