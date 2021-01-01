# file-based-key-value-datastore

File-based key-value data store that supports the basic CRD (create, read, and delete) operations. The data store is thread safe and can receive multiple queries at a time.

### NPM
```
npm install file-based-key-value-datastore --save
```
### Yarn
```
yarn add file-based-key-value-datastore
```

## Use it
`create` accepts `key,value,timeout,path` as parameters.
`read` accepts a `key` as parameter and returns the result in JSON format.
`delete` accepts a `key` as parameter.

```js
const { create, read, deleteKey } = require('file-based-key-value-datastore');

// create(key,value,timeout,path)
create('database', 'nodejs'); 

create('student', { name: 'John', age: 30, branch: 'cse' });

// Using specified path for data store.
create('database', 'nodejs', null, '/Users/user/Downloads/target-folder');

// Using TTL
create('database', 'nodejs', 10000);

// Read from the Data Store
read('database');

// Delete entry from Data Store
deleteKey('database');
```
