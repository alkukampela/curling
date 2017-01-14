let redis = require("redis");
let client = redis.createClient({
    host: 'redis'
});

function set(key, value, cb){
  return client.set(key, JSON.stringify(value), cb);
}

function get(key, cb) {
  return client.get(key, function(err, result){
    cb(err, JSON.parse(result));
  });
}

function keys(pattern, cb) {
  return client.keys(pattern, function(err, result){
    cb(err, result);
  });
}

module.exports = {
  set: set,
  get: get,
  keys: keys
}
