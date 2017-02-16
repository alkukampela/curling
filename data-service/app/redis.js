const R = require('ramda');
const redis = require('redis');
const client = redis.createClient({
  host: 'redis'
});

function set(key, value) {
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

function expire(key, minutes) {
  return new Promise(function(resolve, reject) {
    client.expire(key, R.multiply(minutes, 60), (err, result) => 
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

function getFromQueue(queue) {
  return new Promise(function(resolve, reject) {
    client.rpop(queue, (err, result) =>
      R.isNil(err) ? resolve(JSON.parse(result)) : reject(err)
    );
  });
}

function putToQueue(queue, value) {
  return new Promise(function(resolve, reject) {
    client.lpush(queue, JSON.stringify(value), (err, result) =>
      R.isNil(err) ? resolve(result) : reject(err)
    );
  });
}

module.exports = {
  set: set,
  get: get,
  del: del,
  expire: expire,
  keys: keys,
  getFromQueue: getFromQueue,
  putToQueue: putToQueue
}
