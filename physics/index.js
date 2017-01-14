import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('combined'));

app.get('/*', function (req, res) {
  const response = { stones: [] }
  res.status(200).json(response)
})

app.listen(3005, function () {
  console.log('Listening on port 3005!')
})

// TODO take input like this, simulate and return stones after the throw

const input = {
  "delivery": {
    "team": "1",
    "speed": 8,
    "angle": 3,
    "start_x": 7,
  },
  "stones": [
    {
      "team": "1",
      "x": 89.2,
      "y": 67.7,
    },
    {
      "team": "2",
      "x": 70.0,
      "y": 50.2,
    },
    {
      "team": "1",
      "x": 12.2,
      "y": 9.7,
    },
  ],
};
