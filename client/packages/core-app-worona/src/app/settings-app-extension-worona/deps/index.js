import { dep } from 'worona-deps';

export const actions = {
  get packageActivationRequested() {
    return dep('build', 'actions', 'packageActivationRequested');
  },
  get initialPackagesActivated() {
    return dep('build', 'actions', 'initialPackagesActivated');
  },
};

export const types = {
  get SITE_ID_CHANGED() {
    return dep('router', 'types', 'SITE_ID_CHANGED');
  },
  get PACKAGE_ACTIVATION_SUCCEED() {
    return dep('build', 'types', 'PACKAGE_ACTIVATION_SUCCEED');
  },
};

export const selectors = {
  get getPreview() {
    return dep('router', 'selectors', 'getPreview');
  },
};
