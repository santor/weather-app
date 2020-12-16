/* eslint-disable no-console */
const execa = require('execa');
const fs = require('fs');
(async () => {
  try {
    await execa('git', ['checkout', '--orphan', 'deploy']);
    // eslint-disable-next-line no-console
    console.log('Building started...');
    await execa('yarn', ['build']);
    // Understand if it's dist or build folder
    const folderName = fs.existsSync('dist') ? 'dist' : 'build';
    await execa('git', ['--work-tree', folderName, 'add', '--all']);
    await execa('git', ['--work-tree', folderName, 'commit', '-m', 'deploy']);
    console.log('Pushing to github deploy branch...');
    await execa('git', ['push', 'origin', 'HEAD:deploy', '--force']);
    await execa('rm', ['-r', folderName]);
    await execa('git', ['checkout', '-f', 'main']);
    await execa('git', ['branch', '-D', 'deploy']);
    console.log('Successfully deployed, check your settings');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e.message);
    process.exit(1);
  }
})();
