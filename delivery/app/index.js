let express = require('express');
let morgan = require('morgan');
let axios = require('axios');
let R = require('ramda');

let app = express();

app.use(morgan('combined'));

const broadcaster = 'http://gateway/broadcaster/'
const gameManager = 'http://gateway/gamemanager/';
const stoneStore = 'http://gateway/data-service/stones/'
const scoreCalculator = 'http://gateway/scores/'
const simulator = 'http://gateway/physics/'

function getGame(jwtToken) {
  console.log("getGame", jwtToken);

  // TODO: check if response is not 200 and then return it
  // i.e game not found or other player's turn
  return axios.get(gameManager + 'game_status/' + jwtToken);
}

function getStones(gameId) {
  console.log("getStones", gameId);
  return axios.get(stoneStore + gameId);
}

function validateDeliveryParams(params) {
  return !R.any(R.isNil, R.props(['speed', 'angle', 'start_x'], params));
}

function performSimulation(params) {
  console.log("getSimulation", params);
  return axios.post(simulator + 'simulate/', params);
}

function notifyBroadcaster(gameId, params) {
  console.log("notifyBroadcaster", params);
  return axios.post(broadcaster + gameId, params);
}

function makeDelivery(gameId, params) {
  let requests = [];

  requests.push(performSimulation(params));
  requests.push(notifyBroadcaster(gameId, params));

  return Promise.all(requests);
}

function validateRequest(req, res) {
  let authorization = req.headers.authorization;

  if(!authorization) {
    return res.status(401).json({});
  }

  if(!validateDeliveryParams(req.query)) {
    return res.status(400).json({"error": "Wrong params"});
  }

  // Authorization header format is: 'Bearer <token>'
  return authorization.split(' ')[1];
}

function getSimulationParams(game, deliveryParams) {
  return getStones(game.game_id)
    .then(stoneResponse => {
      let simulationParams = {
        delivery: {
          team: game.team,
          speed: deliveryParams.speed,
          angle: deliveryParams.angle,
          start_x: deliveryParams.start_x
        },
        // TODO: this should not be necessary, stone response should always be array
        stones: R.isEmpty(stoneResponse.data) ? [] : stoneResponse.data
      };

      return Promise.resolve(simulationParams);
    });
}

function saveStones(gameId, stones) {
  return axios.post(stoneStore + gameId, stones);
}

function checkInDelivery(gameId) {
  return axios.post(gameManager + 'check_in_delivery/' + gameId);
}

function getScores(params) {
  return axios.post(scoreCalculator + 'calculate_end_score', params);
}

// TODO: this should be called before calculating end score
function getRadii() {
  return axios.get(simulator + 'radii');
}

function saveEndScore(gameId, endScore) {
  return axios.post(gameManager + 'end_score/' + gameId, endScore);
}

function emptyStones(gameId) {
  return axios.delete(stoneStore + gameId);
}

function handleDelivery(game) {
  return saveStones(game.game_id)
    .then(result => checkInDelivery(game.game_id));
}

function handleLastDelivery(game) {
  return getScores(game.game_id)
    .then(result => saveEndScore(game.game_id, result))
    .then(result => emptyStones(game.game_id));
}

function saveDeliveryState(game) {
  if(game.last_stone) {
    return handleLastDelivery();
  }
  else {
    return handleDelivery(game);
  }
}

app.put('/deliver_stone', function(req, res) {
  let jwt = validateRequest(req, res);

  getGame(jwt)
    .then(gameResponse => {
      console.log('GAME_RESPONSE: ' + gameResponse.data);

      if(gameResponse.status !== 200) {
        return res.status(gameResponse.status).json(gameResponse.data);
      }


      return getSimulationParams(gameResponse.data, req.query)
        .then(simulationParams => makeDelivery(gameResponse.data.game_id, simulationParams))
        .then(lorem => saveDeliveryState(gameResponse.data))
        .then(foobar => res.status(200).json({}));
    })
    .catch(err => res.status(500).json({}) );
})


module.exports = app;
