let express = require('express');
let morgan = require('morgan');
let axios = require('axios');
let R = require('ramda');

let app = express();

app.use(morgan('combined'));

let gateway = 'http://gateway';

function getGame (jwtToken) {
  console.log("getGame", jwtToken);
  return axios.get(gateway + '/gamemanager/get_game_status/' + jwtToken);
}

function getStones (gameId) {
  console.log("getStones", gameId);
  return axios.get(gateway + '/data-service/stones/' + gameId);
}

function validateDeliveryParams (params) {
  return !R.any(R.isNil, R.props(['speed', 'angle', 'start_x'], params));
}

function getSimulation (params) {
  console.log("getSimulation", params);
  return axios.post(gateway + 'physics/simulate/', params);
}

function notifyBroadcaster (params) {
  console.log("notifyBroadcaster", params);
  return axios.post(gateway + '/simulate/', params);
}

function makeDelivery(params) {
  let requests = [];

  requests.push(getSimulation(params));
  requests.push(notifyBroadcaster(params));

  return Promise.all(requests);
}

function validateRequest(req, res) {
  let authorization = req.headers.authorization;

  if(!authorization){
    return res.status(401).json({});
  }

  if(!validateDeliveryParams(req.query)) {

    return res.status(400).json({});
  }

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
          start_x: deliveryParams.start
        },
        stones: stoneResponse.data
      };

      return Promise.resolve(simulationParams);
    });
}

function saveStone (gameId, stone) {
  return axios.post(gateway + '/stones/' + gameId, stone);
}

function checkInDelivery (gameId, params) {
  return axios.post(gateway + '/gamemanager/check_in_delivery/' + gameId, params);
}

function getScores (params) {

}

function saveEndScore (gameId, params) {
  return axios.post(gateway + '/gamemanager/save_end_score/' + gameId, params);
}

function deleteFoobar (gameId, params) {
  return axios.delete(gateway + '/data-service/stones/' + gameId);
}

function handleDelivery (game) {
  return saveStone(game.game_id)
    .then(result => checkInDelivery(game.game_id));
}

function handleLastDelivery (game) {
  return getScores(game.game_id)
    .then(result => saveEndScore(game.game_id))
    .then(result => deleteFoobar(game.game_id));
}

function saveDeliveryState(game) {
  if(game.last_stone){
    return handleLastDelivery();
  }
  else {
    return handleDelivery(game);
  }
}

app.put('/deliver_stone', function (req, res) {
  let jwt = validateRequest(req, res);

  getGame(jwt)
    .then(gameResponse=> {
      if(gameResponse.status !== 200) {
        return res.status(gameResponse.status).json(gameResponse.data);
      }

      return getSimulationParams(gameResponse.data, req.query)
        .then(simulationParams => makeDelivery(gameResponse.data, simulationParams))
        .then(lorem => saveDeliveryState(gameResponse.data))
        .then(foobar => res.status(200).json({}));
    })
    .catch(err => res.status(500).json({}) );

})


module.exports = app;
