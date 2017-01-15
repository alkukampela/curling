let redis = require('./redis');

const keyprefix = 'stones-';

module.exports = function(app){

  app.get('/stones/:id', function(req, res) {
    redis.get(keyprefix + req.params.id)
      .then(result => {
        if(result === null){
          result = [];
        }
        res.status(200).json(result);
      })
      .catch(err => res.status(500).json({}));
  })

  app.post('/stones/:id?', function(req, res) {
    redis.set(keyprefix + req.params.id, req.body)
      .then(result => res.status(200).json(req.body))
      .catch(err => res.status(500).json({}));
  })

  app.delete('/stones/:id?', function(req, res) {
    redis.del(keyprefix + req.params.id)
      .then(result => res.status(200).json({}))
      .catch(err => res.status(500).json({}));
  })

}
