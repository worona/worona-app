import { dep } from 'worona-deps';

export const actions = {
  get packageActivationRequested() { return dep('build', 'actions', 'packageActivationRequested'); },
};
