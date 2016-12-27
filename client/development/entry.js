import 'worona-polyfills';
import { packageDevelopment } from 'worona-deps';
import pkgJson from './test-development-package-worona/package.json';
import * as pkg from './test-development-package-worona/src/app';

packageDevelopment({
  woronaInfo: { ...pkgJson.worona, name: pkgJson.name, namespace: pkgJson.worona.app.namespace },
  ...pkg,
}, pkgJson.name, pkgJson.worona.app.namespace);

console.log('test-development-package-worona loaded!');
