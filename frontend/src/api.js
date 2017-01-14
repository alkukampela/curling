import axios from 'axios';


const ResultsApi = axios.create({
  baseURL: 'http://localhost:5000/',
});

const getActiveGames = () => {
  return ResultsApi
    .get('')
    .then(response => response.data);
};

const getResults = (gameId) => {
  return ResultsApi
    .get(String(gameId))
    .then(response => response.data);
};

export default {
  getActiveGames: getActiveGames,
  getResults: getResults
};