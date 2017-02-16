const redis = require('./redis');
const R = require('ramda');

const KEY_PREFIX = 'games-';

const GAME_LIFETIME_MINS = 15;

function getGameKey(key) {
  return KEY_PREFIX + key;
}

module.exports = function(app) {

  app.get('/games', function (req, res) {
    redis.keys(KEY_PREFIX + '*')
    .then(keys => Promise.all(keys.map(redis.get)))
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json({}));
  })

  app.get('/games/:id', function (req, res) {
    redis.get(getGameKey(req.params.id))
      .then(result => R.isNil(result) 
                        ? res.status(404).json({}) 
                        : res.status(200).json(result))
      .catch(err => res.status(500).json({}));
  })

  app.post('/games/:id', function (req, res) {
    const gameKey = (getGameKey(req.params.id));
    redis.set(gameKey, req.body)
      .then(redis.expire(gameKey, GAME_LIFETIME_MINS))
      .then(result => res.status(201).json(req.body))
      .catch(err => res.status(500).json({}));
  })

  app.put('/games/:id', function (req, res) {
    const gameKey = (getGameKey(req.params.id));
    redis.set(gameKey, req.body)
      .then(redis.expire(gameKey, GAME_LIFETIME_MINS))
      .then(result => res.status(200).json(result))
      .catch(err => res.status(500).json({}));
  });
};
