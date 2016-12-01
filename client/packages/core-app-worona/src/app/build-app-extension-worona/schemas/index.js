import { Schema, arrayOf } from 'normalizr';

export const packages = new Schema('packages', { idAttribute: 'woronaInfo.name' });
export const arrayOfPackages = arrayOf(packages);
