let express = require('express');
let morgan = require('morgan');
let axios = require('axios');

let app = express();

app.use(morgan('combined'));

function getGame (jwtToken) {
  console.log("getGame", jwtToken);
  return axios.get('http://gateway/gamemanager/get_game_status/'+jwtToken);
}

function getStones (gameId) {
  console.log("getStones", gameId);
  return axios.get('http://gateway/data-service/stones/'+gameId);
}

function getSimulation (params) {
  console.log("getSimulation", params);
  return axios.post('http://gateway/simulate/', params);
}

app.put('/deliver_stone', function (req, res) {
  var authorization = req.headers.authorization;

  if(!authorization){
    return res.status(401).json({});
  }

  let jwt = authorization.split(' ')[1];

  getGame(jwt)
    .then(function (response) {
      console.log("getGame ok", response.data);
      if(response.status === 200) {
        // validoidaan heittoparametrit (voima etc)
        getStones(response.data.game_id)
          .then(response2 => {
            var params = {
              delivery: {
                team: response2.data.team,
                speed: req.query.speed,
                angle: req.query.angle,
                start_x: req.query.start
              },
              stones: response.data
            };
            res.status(200).json(response.data);
            // getSimulation(params)
            //   .then(response => {
            //     console.log("getSimulation ok", response.data);
            //     res.status(200).json(response.data);
            //   });
          });



          //
          // x = -100 - 100
          //
          // [21:19]
          // force 0 -14
          //
          // [21:19]
          // eiku siis speed
          //
          // [21:19]
          // angle = 90 suoraan 0-180


        // lähetetään fysiikkamoottorille kivien sijainti ja heiton parametsit

        // lähetetään broadcast-palvelulle heittoparametrit

        // jos oli viimeinen heitto, lasketaan pisteet


      }
      else {
        res.status(500).json({});
      }
    })
    .catch(function (error) {
      res.status(500).json({});
      console.error(error);
    });

})






module.exports = app;
