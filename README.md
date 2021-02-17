# pm2 cluster memory cache
A cluster cache object for pm2 with some different possibilities of data store.

### Instalation
```javascript
npm install pm2-cluster-cache --save
```

### Tests
```javascript
npm run test
```

### Usage
```javascript
const ClusterCache = require('pm2-cluster-cache');
let cache = ClusterCache.init({storage: "cluster"});

//set value to cache for 1s
cache.set('key', 'data', 1000).then(metadata => {
    console.log(metadata);
});

//get value from cache
cache.get('key', "someDefaultValue").then(data => {
    console.log(data);
});

//get cluster data map
cache.keys().then(map => {
    console.log(map);
});
```

### API

- `init(options)` - create new cluster cache. Options object can have following keys:
  - `defaultTtl` - default time to live for keys in ms. Default value is `1000`
  - `storage` - can be one of `self`, `all`, `master`, `cluster`. Default value is `cluster`. 
    - `self` - store to actual process, read from actual process. Every process has his own cache, so this cache is not shared between processes.
    - `all` - store to all processes, read from actual process. Data are duplicated and on every process is stored full replica of all data. If one process restarts, other process are not affected with cache misses.
    - `master` - store to master, read from master. If actual process restarts, other process are not affected with cache miss, if actual process is not master. If master restarts, every process in cluster will lost all cached data.
    - `cluster` - store to specific process, read from specific process. Every process in cluster has part of data, so if one process restarts, other process will lost only part of data. Targer process for storage is detemined by key. 
- `set(key, value, [ttl])` store value under key, with given ttl (in ms). Returns Promise with `metadata`, which contains processes where was key stored and ttl
- `get(key, [defaultValue])` get value stored under key 'key'. If value not find, value of param `defaultValue` will be returned in Promise.
- `delete(key)` removes key from all process where is given key stored. Returns in Promise array of processes deleted from.
- `keys()` returns in Promise map of cluster with numbers of stored keys.

