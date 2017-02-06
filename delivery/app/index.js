const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
const R = require('ramda');

const app = express();

app.use(morgan('combined'));

const gateway = 'http://gateway:8888'
const broadcaster = gateway + '/broadcaster/publish/';
const gameManager = gateway + '/games/';
const stoneStore = gateway + '/data-service/stones/';
const scoreCalculator = gateway + '/scores/';
const simulator = gateway + '/physics/';

const SPEED_INPUT_MIN = 0;
const SPEED_INPUT_MAX = 10;
const SPEED_OUTPUT_MIN = 17;
const SPEED_OUTPUT_MAX = 50;
const ANGLE_INPUT_MIN = 0;
const ANGLE_INPUT_MAX = 180;
const CURL_INPUT_MAXABS = 10;
const CURL_OUTPUT_MAXABS = 0.25;

function getGame(jwtToken) {
  console.log('getGame', jwtToken);

  // TODO: check if response.status is not 200 and then return it
  // i.e game not found or other player's turn
  return axios.get(gameManager + 'game_status/' + jwtToken);
}

function getStones(gameId) {
  console.log('getStones', gameId);
  return axios.get(stoneStore + gameId);
}

function validateDeliveryParams(speed, angle, curl) {
  if (R.any(isNaN)([speed, angle, curl])) {
    return "speed, angle and curl must be numeric";
  }

  speed = Number(speed);
  if (R.either(R.lt(R.__, SPEED_INPUT_MIN), R.gt(R.__, SPEED_INPUT_MAX))(speed)) {
    return `speed must be between ${SPEED_INPUT_MIN} and ${SPEED_INPUT_MAX}`;
  }

  angle = Number(angle);
  if (R.either(R.lt(R.__, ANGLE_INPUT_MIN), R.gt(R.__, ANGLE_INPUT_MAX))(angle)) {
    return `angle must be between ${ANGLE_INPUT_MIN} and ${ANGLE_INPUT_MAX}`;
  }

  curl = Number(curl);
  if (R.either(R.lt(R.__, R.negate(CURL_INPUT_MAXABS)), R.gt(R.__, CURL_INPUT_MAXABS))(curl)) {
    return `curl must be between ${R.negate(CURL_INPUT_MAXABS)} and ${CURL_INPUT_MAXABS}`;
  }

  return;
}

function performSimulation(params) {
  console.log('getSimulation', params);
  return axios.post(simulator + 'simulate/', params);
}

function notifyBroadcaster(gameId, params) {
  console.log('notifyBroadcaster', params);
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

  if (!authorization) {
    return res.status(401).json({'error': 'Jwt token is required'});
  }

  let validationError = validateDeliveryParams(req.query['speed'], 
                                               req.query['angle'], 
                                               req.query['curl']);
  if (validationError) {
    return res.status(400).json({'error': validationError});
  }

  // Authorization header format is: 'Bearer <token>'
  return authorization.split(' ')[1];
}

function normalizeSpeed(inputSpeed) {
  const numberOfSteps = R.subtract(SPEED_INPUT_MAX, SPEED_INPUT_MIN);
  const stepSize = R.divide(R.subtract(SPEED_OUTPUT_MAX, SPEED_OUTPUT_MIN), numberOfSteps);
  return R.add(SPEED_OUTPUT_MIN, R.multiply(inputSpeed, stepSize));
}

function normalizeCurl(inputCurl) {
  const ratio = R.divide(CURL_INPUT_MAXABS, CURL_OUTPUT_MAXABS);
  return R.divide(inputCurl, ratio);
}

function getSimulationParams(game, deliveryParams) {
  const speed = normalizeSpeed(deliveryParams.speed);
  const curl = normalizeCurl(deliveryParams.curl);
  return getStones(game.game_id)
    .then(stoneResponse => {
      let simulationParams = {
        delivery: {
          team: game.team,
          speed,
          curl,
          angle: Number(deliveryParams.angle)
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

function getRadii() {
  return axios.get(simulator + 'radii');
}

function calculateEndScore(radii, stone_locations) {
  const params = {radii: radii, stones: stone_locations}
  return axios.post(scoreCalculator + 'calculate_end_score', params);
}

function saveEndScore(gameId, endScore) {
  return axios.post(gameManager + 'end_score/' + gameId, endScore);
}

function resetStoneLocations(gameId) {
  return axios.delete(stoneStore + gameId);
}

function processEndsLastStone(gameId, stone_locations) {
  return getRadii()
    .then(radii => calculateEndScore(radii.data, stone_locations)
    .then(scores => saveEndScore(gameId, scores.data))
    .then(resetStoneLocations(gameId)));
}

function storeState(gameId, stone_locations) {
  return saveStones(gameId, stone_locations)
    .then(result => checkInDelivery(gameId));
}

function saveDeliveryState(game, stone_locations) {
  if (game.last_stone) {
    return processEndsLastStone(game.game_id, stone_locations);
  }
  return storeState(game.game_id, stone_locations);
}

app.put('/*', function(req, res) {
  let jwt = validateRequest(req, res);

  getGame(jwt)
    .then(gameResponse => {

      if (gameResponse.status !== 200) {
        return res.status(gameResponse.status).json(gameResponse.data);
      }

      return getSimulationParams(gameResponse.data, req.query)
        .then(simulationParams => makeDelivery(gameResponse.data.game_id, simulationParams))
        .then(stone_locations => saveDeliveryState(gameResponse.data, stone_locations[0].data))
        .then(_ => res.status(200).json({}));
    })
    .catch(err => res.status(err.response.status).json(err.response.data) );
})

module.exports = app;
