const fs = require('fs');
// const path = require('path');
const scssBundle = require('scss-bundle');
 
(async () => {
    // Absolute project directory path.
    // const projectDirectory = path.resolve(__dirname, './cases/tilde-import');
    const projectDirectory = './projects/angular-material-datatransfer/src/assets/style';
    const bundler = new scssBundle.Bundler(undefined, projectDirectory);
    // Relative file path to project directory path.
    const result = await bundler.bundle('./main.scss');
    const outPath = './dist/angular-material-datatransfer/assets/style/';
    fs.mkdirSync(outPath, { recursive: true });
    fs.writeFileSync(outPath + 'styles.scss', result.bundledContent);
})();