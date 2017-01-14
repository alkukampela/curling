let express = require('express');
let morgan = require('morgan');
let axios = require('axios');

let app = express();

app.use(morgan('combined'));

/*
app.get('/*', function (req, res) {
  let dataUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json';

  axios.get(dataUrl)
  .then(function (response) {
    res.status(200).json(response.data);
  })
  .catch(function (error) {
    res.status(500).json({});
    console.error(error);
  });
})
*/

app.put('/deliver_stone', function (req, res) {
  let jwt = req.headers.authorization.split(' ')[1]
  let dataUrl = 'http://gateway/gamemanager/get_game_status/'+jwt;

  axios.get(dataUrl)
  .then(function (response) {
    res.status(200).json(response.data);
  })
  .catch(function (error) {
    res.status(500).json({});
    console.error(error);
  });

})






module.exports = app;
