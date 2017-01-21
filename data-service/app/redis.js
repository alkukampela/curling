const R = require('ramda');
const redis = require('redis');
const client = redis.createClient({
  host: 'redis'
});

function set(key, value) {
  console.log(key + ' '+JSON.stringify(value))
  return new Promise(function(resolve, reject) {
    client.set(key, JSON.stringify(value), (err, result) => 
      R.isNil(err) ? resolve(result) : reject(err)
    );
  });
}

function get(key) {
  return new Promise(function(resolve, reject) {
    client.get(key, (err, result) => 
      R.isNil(err) ? resolve(JSON.parse(result)) : reject(err)
    );
  });
}

function del(key) {
  return new Promise(function(resolve, reject) {
    client.del(key, (err, result) => 
      R.isNil(err) ? resolve(result) : reject(err)
    );
  });
}

function keys(pattern) {
  return new Promise(function(resolve, reject) {
    client.keys(pattern, (err, result) => 
      R.isNil(err) ? resolve(result) : reject(err)
    );
  });
}

function pop(queue) {
  return new Promise(function(resolve, reject) {
    client.lpop(queue, (err, result) =>
      R.isNil(err) ? resolve(JSON.parse(result)) : reject(err)
    );
  });
}

function push(queue, value) {
  return new Promise(function(resolve, reject) {
    client.rpush(queue, JSON.stringify(value), (err, result) =>
      R.isNil(err) ? resolve(result) : reject(err)
    );
  });
}

module.exports = {
  set: set,
  get: get,
  del: del,
  keys: keys,
  pop: pop,
  push: push
}
