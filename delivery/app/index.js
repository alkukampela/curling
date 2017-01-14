let express = require('express');
let morgan = require('morgan');
let axios = require('axios');

let app = express();

app.use(morgan('combined'));

app.put('/deliver_stone', function (req, res) {
  var authorization = req.headers.authorization;

  if(!authorization){
    return res.status(401).json({});
  }

  let jwt = authorization.split(' ')[1]
  let dataUrl = 'http://gateway/gamemanager/get_game_status/'+jwt;

  axios.get(dataUrl)
    .then(function (response) {
      if(resonse.status === 200) {
        console.log("ok!");


        res.status(200).json(response.data);
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
