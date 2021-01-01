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
    // Get the dataStore from the specified dataStorePath
    const localDataStore = JSON.parse(
      fs.readFileSync(`${dataStorePath}/data/data.json`)
    );

    // Check if the key is present in the local dataStore
    if (localDataStore[key] !== undefined) {
      const currentTime = moment().format('hh:mma');
      const exprTime = localDataStore[key].timeout;
      if (currentTime < exprTime || exprTime === null) {
        ans = localDataStore[key].value;
      } else {
        // If the TTL is expired then delete from the local dataStore
        deleteKey(key);
        ans = 'Session Expired!!';
        process.exit();
      }
    }
    // If the key is not present in the data store,
    else {
      ans = 'Key not found in the data store!';
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
