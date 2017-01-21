const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({
  extended: true
}));

const game = require('./game')(app);
const stone = require('./stone')(app);
const newGame = require('./newgame')(app);

module.exports = app;
