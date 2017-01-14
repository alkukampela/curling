import Matter from 'matter-js'
const { Engine, Render, World, Bodies, Body, Events, Vector, Bounds } = Matter

const FRICTION = 0.1
const RADIUS = 5

// Stones out of bounds are removed from the sheet.
// The simulation is stopped when there are either no stones
// inside bounds or all the stones are slower than MIN_SPEED.
const BOUNDS = {
  min: { x: 0, y: 0 },
  max: { x: 800, y: 600 },
}
const MIN_SPEED = 0.001

// TODO mathematics
const getVelocity = (speed, angle) => Vector.create(0, 10)

const createStone = (x, y, team) => {
  const stone = Bodies.circle(x, y, RADIUS, { frictionAir: FRICTION })
  stone.team = team
  return stone
}

const createStones = (delivery, stones) => {
  const stationary = stones.map(s => createStone(s.x, s.y, s.team))
  const delivered = createStone(delivery.start_x, 0, delivery.team)
  Body.setVelocity(delivered, getVelocity(delivery.speed, delivery.angle))
  return [delivered, ...stationary]
}

const createEngine = matterStones => {
  const engine = Engine.create()
  engine.world.gravity = Vector.create(0, 0)
  World.add(engine.world, matterStones)
  return engine
}

const stoneToJson = stone => {
  const { x, y } = stone.position
  const team = stone.team
  return { x, y, team }
}

const isOutOfBounds = stone => !Bounds.overlaps(stone.bounds, BOUNDS)
const isMoving = stone => Vector.magnitude(stone.velocity) > MIN_SPEED

const render = (delivery, stones) => {
  // TODO frontend rendering
}

const simulate = (delivery, stones) => {
  const matterStones = createStones(delivery, stones)
  const engine = createEngine(matterStones)
  const world = engine.world

  while (world.bodies.length > 0 && world.bodies.some(isMoving)) {
    // Update matter simulation
    Events.trigger(engine, 'tick', { timestamp: engine.timing.timestamp })
    Engine.update(engine, engine.timing.delta)
    Events.trigger(engine, 'afterTick', { timestamp: engine.timing.timestamp })

    // Remove items that are out of bounds
    world.bodies
      .filter(isOutOfBounds)
      .forEach(stone => World.remove(world, stone))
  }

  return world.bodies.map(stoneToJson)
}

export { simulate, render }