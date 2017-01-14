let express = require('express');

let app = require('./app');

app.listen(5000, function () {
  console.log('Data service listening on port 5000!')
})
