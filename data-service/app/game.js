let redis = require('./redis');

module.exports = function(app){

  app.get('/games', function (req, res) {
    redis.keys('games-*', function (err, keys) {
      if (err){ 
        res.status(200).json([]);
        return;
      }
      
      let games = []
      
      keys.forEach(function (key) {
        redis.get(key, function(game){
          games.push(game);
        })
      });
      
      res.status(200).json(games);
    });        


    redis.get('games', function(err, result){
      res.status(200).json(result || []);
    })
  })

  app.get('/games/:id', function (req, res) {
    let id = req.params.id;

    redis.get('games-' + id, function(err, result){
      if (result === null) {
        res.status(404).json();
      }
      else {
        res.status(200).json(result);
      }
    });
  })

  app.post('/games/:id?', function (req, res) {
    let id = req.params.id;

    redis.set('games-' + id, req.body, function(err, result){
      res.status(201).json(req.body);
    });
  })

  app.put('/games/:id?', function (req, res) {
    let id = req.params.id;

    redis.set('games-' + id, req.body, function(err, result){
      res.status(201).json(req.body);
    });

  });
};
