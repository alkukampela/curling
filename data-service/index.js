let express = require('express');

let app = require('./app');

app.listen(3721, function () {
  console.log('Data service listening on port 3721!')
})
