import 'worona-polyfills';
import { packageDevelopment } from 'worona-deps';
import pkgJson from './test-development-package-worona/package.json';
import * as pkg from './test-development-package-worona/src/app';

const namespace = pkgJson.worona.app.namespace;

packageDevelopment({
  woronaInfo: { name: pkgJson.name, namespace },
  ...pkg,
}, pkgJson.name, namespace);

console.log('test-development-package-worona loaded!');
