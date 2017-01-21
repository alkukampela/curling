const redis = require('./redis');

const KEY = 'new_games';

module.exports = function(app){

  app.get('/newgames/', function (req, res) {
    redis.pop(KEY)
      .then(result => res.status(200).json(result))
      .catch(err => res.status(500).json(err));
  })

  app.post('/newgames/', function (req, res) {
    redis.push(KEY, req.body)
      .then(result => res.status(201).json(req.body))
      .catch(err => res.status(500).json({}));
  })

}
