import { spawn } from 'child-process-promise';
import replace from 'replace-in-file';
import { readFile, copy, remove } from 'fs-extra';

const build = async () => {
  console.log('\n=> Building webpack.\n');
  await spawn('webpack', [ '-p' ], { stdio: 'inherit' });
  console.log('\n=> Reading bundle.js.\n');
  const bundle = await readFile('bundle.js');
  console.log('=> Deleting old index.html.\n');
  await remove('index.html');
  console.log('=> Duplicating index-template.html.\n');
  await copy('index-template.html', 'index.html');
  console.log('=> Replacing index.html.\n');
  await replace({
    files: 'index.html',
    from: /###JAVASCRIPT###/,
    to: bundle,
  })
}

build();
