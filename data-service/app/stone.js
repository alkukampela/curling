let redis = require('./redis');

module.exports = function(app){

  app.get('/stones/:id', function (req, res) {
    redis.get('stones-' + req.params.id)
      .then(result => {
        if(result === null){
          result = [];

          res.status(200).json(result);
        }
      })
      .catch(err => res.status(500).json({}));
  })

  app.post('/stones/:id?', function (req, res) {
    redis.set('stones-' + req.params.id, req.body)
      .then(result => res.status(201).json(req.body))
      .catch(err => res.status(500).json({}));
  })

}
