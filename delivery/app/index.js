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
const humanizer = gateway + '/humanizer/';

const WEIGHT_INPUT_MIN = 0;
const WEIGHT_INPUT_MAX = 10;
const WEIGHT_OUTPUT_MIN = 17;
const WEIGHT_OUTPUT_MAX = 50;
const WEIGHT_VARIANCE = 1.0;
const LINE_MIN = 0;
const LINE_MAX = 180;
const LINE_VARIANCE = 0.3;
const CURL_INPUT_MAXABS = 10;
const CURL_OUTPUT_MAXABS = 0.25;
const CURL_VARIANCE = 0.02;

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

function userAgentIsValid(req) {
  return req.headers['user-agent'].startsWith('curl') ? true : false;
}

function validateDeliveryParams(weight, line, curl) {
  if (R.any(isNaN)([weight, line, curl])) {
    return "weight, line and curl must be numeric";
  }

  weight = Number(weight);
  if (R.either(R.lt(R.__, WEIGHT_INPUT_MIN), R.gt(R.__, WEIGHT_INPUT_MAX))(weight)) {
    return `weight must be between ${WEIGHT_INPUT_MIN} and ${WEIGHT_INPUT_MAX}`;
  }

  line = Number(line);
  if (R.either(R.lt(R.__, LINE_MIN), R.gt(R.__, LINE_MAX))(line)) {
    return `line must be between ${LINE_MIN} and ${LINE_MAX}`;
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
  if (!userAgentIsValid(req)) {
    return res.status(406).json({'error': 'Use cUrl please. (Or at least bother to fake it)'});
  }

  let authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({'error': 'Jwt token is required'});
  }

  let validationError = validateDeliveryParams(req.query['weight'],
                                               req.query['line'],
                                               req.query['curl']);
  if (validationError) {
    return res.status(400).json({'error': validationError});
  }

  // Authorization header format is: 'Bearer <token>'
  return authorization.split(' ')[1];
}

function normalizeWeight(inputWeight) {
  const numberOfSteps = R.subtract(WEIGHT_INPUT_MAX, WEIGHT_INPUT_MIN);
  const stepSize = R.divide(R.subtract(WEIGHT_OUTPUT_MAX, WEIGHT_OUTPUT_MIN), numberOfSteps);
  return R.add(WEIGHT_OUTPUT_MIN, R.multiply(inputWeight, stepSize));
}

function normalizeCurl(inputCurl) {
  const ratio = R.divide(CURL_INPUT_MAXABS, CURL_OUTPUT_MAXABS);
  return R.divide(inputCurl, ratio);
}

function humanizeParameters(simulationParams) {
  const deliveryParams = simulationParams.delivery;
  const humanizerInput = [
    {
      key: 'weight',
      value: deliveryParams.weight,
      min: WEIGHT_OUTPUT_MIN,
      max: WEIGHT_OUTPUT_MAX,
      variance: WEIGHT_VARIANCE
    },
    {
      key: 'curl',
      value: deliveryParams.curl,
      min: R.negate(CURL_OUTPUT_MAXABS),
      max: CURL_OUTPUT_MAXABS,
      variance: CURL_VARIANCE
    },
    {
      key: 'line',
      value: deliveryParams.line,
      min: LINE_MIN,
      max: LINE_MAX,
      variance: LINE_VARIANCE
    }
  ];
  return axios
    .post(humanizer, humanizerInput)
    .then(humanizerOutput => {
      humanizerOutput.data.forEach(param => {
        simulationParams.delivery[param.Key] = param.Value;
      });
      return simulationParams;
    })
}

function getSimulationParams(game, deliveryParams) {
  const weight = normalizeWeight(deliveryParams.weight);
  const curl = normalizeCurl(deliveryParams.curl);
  return getStones(game.game_id)
    .then(stoneResponse => {
      let simulationParams = {
        delivery: {
          team: game.team,
          weight,
          curl,
          line: Number(deliveryParams.line)
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
        .then(simulationParams => humanizeParameters(simulationParams))
        .then(simulationParams => makeDelivery(gameResponse.data.game_id, simulationParams))
        .then(stone_locations => saveDeliveryState(gameResponse.data, stone_locations[0].data))
        .then(_ => res.status(200).json({}));
    })
    .catch(err => res.status(err.response.status).json(err.response.data) );
})

module.exports = app;
