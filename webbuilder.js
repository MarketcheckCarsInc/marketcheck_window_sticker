const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/zerebralwidget/runtime.js',
    './dist/zerebralwidget/polyfills.js',
    './dist/zerebralwidget/main.js'
  ];

  await fs.ensureDir('elements');
  await concat(files, 'elements/mc.js');
  await fs.copyFile(
    './dist/zerebralwidget/styles.css',
    'elements/styles.css'
  );
})();