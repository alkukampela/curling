const redis = require('./redis');

const QUEUE = 'new_games';

module.exports = function(app){

  app.post('/newgame/join', function (req, res) {
    redis.getFromQueue(QUEUE)
      .then(result => res.status(200).json(result))
      .catch(err => res.status(500).json(err));
  })

  app.post('/newgame/init', function (req, res) {
    redis.putToQueue(QUEUE, req.body)
      .then(result => res.status(201).json(req.body))
      .catch(err => res.status(500).json({}));
  })

}
