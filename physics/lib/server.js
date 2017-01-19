import express from 'express'
import bodyParser from 'body-parser'
import { simulate, HOUSE_RADIUS, STONE_RADIUS } from './simulation'

const server = express();
server.use(bodyParser.json());

server.post('/simulate', (req, res) => {
  const { delivery, stones } = req.body
  console.log('Simulating delivery', delivery, stones)
  const results = simulate(delivery, stones)
  console.log('Simulation complete', results)
  res.status(200).json(results)
})

server.get('/radii', (req, res) => {
  res.status(200).json({
    house: HOUSE_RADIUS,
    stone: STONE_RADIUS,
  })
})

export default server
