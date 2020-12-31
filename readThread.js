const { parentPort } = require('worker_threads');
const { deleteKey } = require('./app');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

if (fs.existsSync('./utils.json')) {
  const urlData = require('./utils.json');

  let ans = NaN;

  const read = (params) => {
    let key = params[0];
    let dataStorePath = urlData.url;
    const localDataStore = JSON.parse(
      fs.readFileSync(`${dataStorePath}/data/data.json`)
    );

    const currentTime = moment().format('hh:mma');
    const exprTime = localDataStore[key].timeout;
    if (currentTime < exprTime) {
      ans = parseInt(localDataStore[key].value);
    } else {
      deleteKey(key);
      ans = 'Session Expired!!';
      process.exit();
    }
  };

  parentPort.on('message', (params) => {
    read(params);
    // console.log('From child Thread', ans);
    parentPort.postMessage(ans);
  });
} else {
  console.log('Data Store not Found,try creating a Data Store');
  process.exit();
}
