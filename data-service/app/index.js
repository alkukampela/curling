let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');

let app = express();

app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({
  extended: true
}));


let game = require('./game')(app);
let stone = require('./stone')(app);

module.exports = app;
