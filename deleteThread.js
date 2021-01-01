const { parentPort } = require('worker_threads');
const moment = require('moment');
const fs = require('fs');

if (fs.existsSync('./utils.json')) {
  // Do something
  const urlData = require('./utils.json');

  let ans = NaN;

  const del = (params) => {
    let key = params[0];
    let dataStorePath = urlData.url;

    // If Path is already present
    const localDataStore = JSON.parse(
      fs.readFileSync(`${dataStorePath}/data/data.json`)
    );
    if (localDataStore[key]) {
      delete localDataStore[key];
      fs.writeFileSync(
        `${dataStorePath}/data/data.json`,
        JSON.stringify(localDataStore, null, 2)
      );
      ans = 'Deleted the Entry';
    } else {
      ans = 'Key not present in the data store';
    }
  };

  parentPort.on('message', (params) => {
    del(params);
    parentPort.postMessage(ans);
  });
} else {
  console.log('Data Store not Found,try creating a Data Store');
  process.exit();
}
