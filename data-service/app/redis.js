let redis = require("redis");
let client = redis.createClient({
    host: 'redis'
});

function set(key, value){
  return new Promise(function(resolve, reject){
    client.set(key, JSON.stringify(value), function(err, result){
      if(err){
        return reject(err);
      }

      resolve(result);
    });
  });
}

function get(key) {
  console.log("get", key)
  return new Promise(function(resolve, reject){
    client.get(key, function(err, result){
      if(err){
        return reject(err);
      }

      resolve(JSON.parse(result));
    });
  });
}

function keys(pattern) {
  return new Promise(function(resolve, reject){
    client.keys(pattern, function(err, result){
      if(err){
        return reject(err);
      }

      resolve(result);
    });
  });

}

module.exports = {
  set: set,
  get: get,
  keys: keys
}
