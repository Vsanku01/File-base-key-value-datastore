const fs = require('fs');
const moment = require('moment');
const path = require('path');
const jsonSize = require('json-size');
const { Worker } = require('worker_threads');

let dataStore = {};
let dataStorePath = '';

const create = (key, value, timeout, path = '') => {
  value = {
    value,
    timeout: moment().add(timeout, 'seconds').format('hh:mma'),
  };
  if (path === '') {
    // Initialize the optional path.
    writeToDirectory('./', key, value);
    dataStorePath = './';
  } else {
    // If the client sends the path
    try {
      if (fs.existsSync(path?.toString())) {
        // Check if the paths exists in the filesystem
        // Then create a directory there and write to the file
        dataStorePath = path;
        console.log('Updating path', dataStorePath);
        writeToDirectory(path, key, value);
      } else {
        console.log('Path does not exist');
      }
    } catch (error) {
      console.log('An error occurred!');
    }
  }
};

const writeToDirectory = (path, key, value) => {
  // Create a new directory at the path specified

  // Write to the local Cache
  const dataPath = {
    url: path,
  };
  fs.writeFileSync(`./utils.json`, JSON.stringify(dataPath, null, 2));

  fs.mkdir(`${path}/data`, (err) => {
    // If Error while creating a directory
    if (err) {
      if (fs.existsSync(`${path}/data`)) {
        let jsonData = fs.readFileSync(`${path}/data/data.json`);
        dataStore = JSON.parse(jsonData);

        // If the same key is not present in data.json
        if (
          !dataStore.hasOwnProperty(key) &&
          jsonSize(dataStore) < 1073741824
        ) {
          dataStore[key] = value;
          const addData = JSON.stringify(dataStore, null, 2);
          fs.writeFileSync(`${path}/data/data.json`, addData);
          console.log('Created an entry in the data store');
        } else {
          console.log(
            'Object with the same key exists in the data store, try again with unused key value'
          );
        }
      } else {
        console.log('Error creating Directory!');
      }
    }
    // Creating New Directory..
    else {
      let newDataStore = {};
      newDataStore[key] = value;
      fs.writeFileSync(
        `${path}/data/data.json`,
        JSON.stringify(newDataStore, null, 2)
      );
    }
  });
};

const deleteKey = (key) => {
  const deleteThread = new Worker(__dirname + '/deleteThread.js');
  deleteThread.on('message', async (result) => {
    console.log(`Processed function on seperate thread: ${result}`);
    process.exit();
  });
  deleteThread.postMessage([key, dataStorePath]);
};

const read = (key) => {
  const createThread = new Worker(__dirname + '/readThread.js');
  createThread.on('message', async (result) => {
    let answer = await result;
    console.log({ value: answer });
    process.exit();
  });
  createThread.postMessage([key, dataStorePath]);
};

module.exports = {
  create,
  read,
  deleteKey,
};

// create('test2', 25, 10000);
