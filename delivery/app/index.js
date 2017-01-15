let express = require('express');
let morgan = require('morgan');
let axios = require('axios');

let app = express();

app.use(morgan('combined'));

function getGame (jwtToken) {
  return axios.get('http://gateway/gamemanager/get_game_status/'+jwtToken);
}

function getStones (gameId) {
  return axios.get('http://gateway/data-service/stones/'+gameId);
}

app.put('/deliver_stone', function (req, res) {
  var authorization = req.headers.authorization;

  if(!authorization){
    return res.status(401).json({});
  }

  let jwt = authorization.split(' ')[1];

  getGame(jwt)
    .then(function (response) {
      if(response.status === 200) {
        // validoidaan heittoparametrit (voima etc)
        getStones(response.data.game_id)
          .then(response => {
            res.status(200).json(response.data);
          });


        // datapalvelusta game id:llä kivien sijainti

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
