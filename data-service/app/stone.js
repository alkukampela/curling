const redis = require('./redis');

const KEY_PREFIX = 'stones-';

module.exports = function(app){

  app.get('/stones/:id', function(req, res) {
    // TODO: check that id is not empty, if return 400
    redis.get(KEY_PREFIX + req.params.id)
      .then(result => {
        // !!!URGENT TODO: USE RAMDA!!!
        if(result === null){
          result = [];
        }
        res.status(200).json(result);
      })
      .catch(err => res.status(500).json({}));
  })

  app.post('/stones/:id?', function(req, res) {
    // TODO: check that id is not empty, if return 400
    redis.set(KEY_PREFIX + req.params.id, req.body)
      .then(result => res.status(200).json(req.body))
      .catch(err => res.status(500).json({}));
  })

  app.delete('/stones/:id?', function(req, res) {
    // TODO: check that id is not empty, if return 400
    redis.del(KEY_PREFIX + req.params.id)
      .then(result => res.status(200).json({}))
      .catch(err => res.status(500).json({}));
  })

}
