import Matter from 'matter-js'
const { Engine, Render, World, Bodies, Body, Events, Vector } = Matter;

const FRICTION = 0.1
const RADIUS = 35

// TODO mathematics
const getVelocity = (speed, angle) => Vector.create(0, 0)

const createStone = (x, y, team) => {
  const stone = Bodies.circle(x, y, RADIUS, { frictionAir: FRICTION })
  stone.team = team
  return stone
}

const createStones = (delivery, stones) => {
  const stationary = stones.map(stone => createStone(stone.x, stone.y, stone.team))
  const delivered = createStone(delivery.start_x, 0, delivery.team)
  Body.setVelocity(delivered, getVelocity(delivery.speed, delivery.angle))
  return [delivered, ...stationary]
}

const stoneToJson = stone => {
  const { x, y } = stone.position
  const team = stone.team
  return { x, y, team }
}

const createEngine = () => {
  const engine = Engine.create()
  engine.world.gravity = Vector.create(0, 0)
  return engine
}

const render = () => {
  // TODO frontend rendering
}

const simulate = (delivery, stones) => {
  const matterStones = createStones(delivery, stones)
  const engine = createEngine()
  World.add(engine.world, matterStones)
  // TODO run until all the stones are outside field or have stopped
  for (let i = 0; i < 10000; i++) {
    Matter.Events.trigger(engine, 'tick', { timestamp: engine.timing.timestamp });
    Matter.Engine.update(engine, engine.timing.delta);
    Matter.Events.trigger(engine, 'afterTick', { timestamp: engine.timing.timestamp });
  }
  return matterStones.map(stoneToJson)
}

export { simulate, render }