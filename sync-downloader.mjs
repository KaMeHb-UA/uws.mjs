import cp from 'child_process';

const downloaderCode = `
const fs = require('fs');
const https = require('https');
const fws = fs.createWriteStream(process.argv[2]);
https.get(process.argv[1], response => {
    response.pipe(fws);
    fws.on('finish', () => fws.close())
}).on('error', err => {
    fs.unlink(process.argv[2]);
    throw err
})`;

export default (url, file) => {
    cp.spawnSync(process.argv0, ['-e', downloaderCode, url, file], {
        stdio: 'inherit',
    });
}
