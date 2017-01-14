let express = require('express');
let request = require('request');
let app = require('./app');

app.listen(3000, function () {
  console.log('Delivery service listening on port 3000!')
})


app.put('/deliver_stone', function (req, res) {
  let jwt = req.headers.authorization.split(' ')[1]

  request('http://localhost:9600/get_game_status/'+jwt, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body)
  } else {
    console.log(error);
  }
})


})
