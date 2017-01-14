import Matter from 'matter-js'
const { Engine, Render, World, Bodies, Body, Events, Vector, Bounds } = Matter

const FRICTION = 0.125
const RADIUS = 5

// Stones out of bounds are removed from the sheet.
// The simulation is stopped when there are either no stones
// inside bounds or all the stones are slower than MIN_SPEED.
const BOUNDS = {
  min: { x: -50, y: -500 },
  max: { x: 50, y: 100 },
}
const MIN_SPEED = 0.0001

const getVelocity = (speed, angle) => {
  const vx = speed * Math.cos(angle * Math.PI/180)
  const vy = speed * Math.cos((90 - angle) * Math.PI/180)
  return Vector.create(vx, vy)
}

const createStone = (x, y, team) => {
  const stone = Bodies.circle(x, y, RADIUS, { frictionAir: FRICTION })
  stone.team = team
  return stone
}

const createStones = (delivery, stones) => {
  const stationary = stones.map(s => createStone(s.x, s.y, s.team))
  const delivered = createStone(delivery.start_x, BOUNDS.min.y, delivery.team)
  Body.setVelocity(delivered, getVelocity(delivery.speed, delivery.angle))
  return [delivered, ...stationary]
}

const createEngine = matterStones => {
  const engine = Engine.create()
  engine.world.gravity = Vector.create(0, 0)
  World.add(engine.world, matterStones)

  // Remove items that are out of bounds
  Events.on(engine, 'afterUpdate', () => {
    engine.world.bodies
      .filter(isOutOfBounds)
      .forEach(stone => World.remove(engine.world, stone))
  })

  return engine
}

const stoneToJson = stone => {
  const { x, y } = stone.position
  const team = stone.team
  return { x, y, team }
}

const isOutOfBounds = stone => !Bounds.overlaps(stone.bounds, BOUNDS)
const isMoving = stone => Vector.magnitude(stone.velocity) > MIN_SPEED

const render = (delivery, stones, element) => {
  const matterStones = createStones(delivery, stones)
  const engine = createEngine(matterStones)
  const renderer = Render.create({ element, engine });
  Engine.run(engine);
  Render.run(render);
}

const simulate = (delivery, stones) => {
  const matterStones = createStones(delivery, stones)
  const engine = createEngine(matterStones)
  const world = engine.world

  while (world.bodies.length > 0 && world.bodies.some(isMoving)) {
    Events.trigger(engine, 'tick', { timestamp: engine.timing.timestamp })
    Engine.update(engine, engine.timing.delta)
    Events.trigger(engine, 'afterTick', { timestamp: engine.timing.timestamp })
  }

  return world.bodies.map(stoneToJson)
}

export { simulate, render }