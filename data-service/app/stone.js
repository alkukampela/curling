const redis = require('./redis');
const R = require('ramda');

const KEY_PREFIX = 'stones-';

module.exports = function(app){

 
  app.get('/stones/:id', function(req, res) {
    redis.get(KEY_PREFIX + req.params.id)
      .then(result => R.isNil(result)
                        // No saved stones can also be okay situtation
                        // so we return empty array
                        ? res.status(200).json([])
                        : res.status(200).json(result))
      .catch(err => res.status(500).json({}));
  })

  app.post('/stones/:id', function(req, res) {
    redis.set(KEY_PREFIX + req.params.id, req.body)
      .then(result => res.status(200).json(req.body))
      .catch(err => res.status(500).json({}));
  })

  app.delete('/stones/:id', function(req, res) {
    redis.del(KEY_PREFIX + req.params.id)
      .then(result => res.status(200).json({}))
      .catch(err => res.status(500).json({}));
  })

}
