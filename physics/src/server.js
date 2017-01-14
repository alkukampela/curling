import express from 'express'
import bodyParser from 'body-parser';
import simulate from './simulation'

const server = express();
server.use(bodyParser.json());

server.post('/', (req, res) => {
  const { delivery, stones } = req.body
  const results = simulate(delivery, stones)
  res.status(200).json(results)
})

export default server
