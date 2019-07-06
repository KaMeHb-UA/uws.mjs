import syncDownload from './sync-downloader.mjs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const cdnRoot = 'https://cdn.jsdelivr.net/gh/uNetworking/uWebSockets.js@' +
    '15.11.0' // version to be downloaded

const __tmpdir = os.tmpdir();

function rand(){
    return Math.random().toString(36).substring(2, 15)
}

const modulePath = path.resolve(__tmpdir, rand() + '.node');
try{
    process.stdout.write('Downloading µWS precompiled binary... ');
    syncDownload(cdnRoot + '/uws_' + process.platform + '_' + process.arch + '_' + process.versions.modules + '.node', modulePath);
    console.log('done.')
} catch (e){
    throw new Error(`Cannot download precompiled µWS binary. Maybe there is no binary for your node version? Check it yourself: ${cdnRoot}/\n`)
}

const uWS = require(modulePath);
process.nextTick = (f, ...args) => {
    Promise.resolve().then(() => {
        f(...args);
    });
};
process.on('exit', uWS.free);

export default uWS
