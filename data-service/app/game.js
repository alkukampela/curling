const redis = require('./redis');

const KEY_PREFIX = 'games-';

module.exports = function(app){

  app.get('/games', function (req, res) {
    redis.keys(KEY_PREFIX + '*')
    .then(keys => Promise.all(keys.map(redis.get)))
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json({}));
  })

  app.get('/games/:id', function (req, res) {
    redis.get(KEY_PREFIX + req.params.id)
      .then(result => res.status(200).json(result))
      .catch(err => res.status(500).json({}));
  })

  app.post('/games/:id?', function (req, res) {
    // TODO: check that id is not empty, if return 400
    redis.set(KEY_PREFIX + req.params.id, req.body)
      .then(result => res.status(201).json(req.body))
      .catch(err => res.status(500).json({}));
  })

  app.put('/games/:id?', function (req, res) {
    // TODO: check that id is not empty, if return 400
    redis.set(KEY_PREFIX + req.params.id, req.body)
      .then(result => res.status(200).json(result))
      .catch(err => res.status(500).json({}));
  });
};
