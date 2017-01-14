let redis = require('./redis');

module.exports = function(app){

  app.get('/games', function (req, res) {
    redis.keys('games-*')
    .then(keys => {
      return Promise.all(keys.map(redis.get));
    })
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json({}));
  })

  app.get('/games/:id', function (req, res) {
    redis.get('games-' + req.params.id)
      .then(result => res.status(200).json(result))
      .catch(err => res.status(500).json({}));
  })

  app.post('/games/:id?', function (req, res) {
    redis.set('games-' + req.params.id, req.body)
      .then(result => res.status(201).json(req.body))
      .catch(err => res.status(500).json({}));
  })

  app.put('/games/:id?', function (req, res) {
    redis.set('games-' + req.params.id, req.body)
      .then(result => res.status(201).json(result))
      .catch(err => res.status(500).json({}));
  });
};
