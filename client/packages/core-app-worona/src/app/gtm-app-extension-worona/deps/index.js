import { dep } from 'worona-deps';

export const types = {
  get SITE_ID_CHANGED() { return dep('router', 'types', 'SITE_ID_CHANGED'); },
}

export const selectors = {
  get getPreview() { return dep('router', 'selectors', 'getPreview'); },
};