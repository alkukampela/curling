let express = require('express');
let morgan = require('morgan');
let axios = require('axios');

let app = express();

app.use(morgan('combined'));

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

module.exports = app;
