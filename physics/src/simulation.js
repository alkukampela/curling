import Matter from 'matter-js'
const { Engine, Render, World, Bodies, Body, Events, Vector, Bounds } = Matter

// TODO: adjust the values (radii, bounds) to match visualization
const FRICTION = 0.02
const STONE_RADIUS = 10
const HOUSE_RADIUS = 50

// Stones out of bounds are removed from the sheet.
// The simulation is stopped when there are either no stones
// inside bounds or all the stones are slower than MIN_SPEED.
const BOUNDS = {
  min: { x: -100, y: -100 },
  max: { x: 100, y: 500 },
}
const MIN_SPEED = 0.01

const getVelocity = (speed, angle) => {
  const vx = speed * Math.cos(angle * Math.PI/180)
  const vy = -speed * Math.cos((90 - angle) * Math.PI/180)
  return Vector.create(vx, vy)
}

const createStone = (x, y, team) => {
  const stone = Bodies.circle(x, y, STONE_RADIUS, { frictionAir: FRICTION })
  stone.team = team
  return stone
}

const createStones = (delivery, stones) => {
  const stationary = stones.map(s => createStone(s.x, s.y, s.team))
  const delivered = createStone(delivery.start_x, BOUNDS.max.y, delivery.team)
  Body.setVelocity(delivered, getVelocity(delivery.speed, delivery.angle))
  return [delivered, ...stationary]
}

const createEngine = matterStones => {
  const engine = Engine.create()
  engine.world.gravity = Vector.create(0, 0)
  World.add(engine.world, matterStones)
  Events.on(engine, 'afterUpdate', () => {
    // Remove items that are out of bounds
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
const shouldStop = stones => stones.length == 0 || !stones.some(isMoving)

const render = (delivery, stones, element) => {
  const matterStones = createStones(delivery, stones)
  const engine = createEngine(matterStones)
  const world = engine.world
  const renderer = Render.create({
    element,
    engine,
    bounds: BOUNDS,
    options: {
      hasBounds: true,
      height: BOUNDS.max.y - BOUNDS.min.y,
      width: BOUNDS.max.x - BOUNDS.min.x,
    },
  })
  Events.on(renderer, 'afterRender', () => {
    if (shouldStop(world.bodies)) {
      Render.stop(renderer)
    }
  })
  Engine.run(engine)
  Render.run(renderer)
}

const simulate = (delivery, stones) => {
  const matterStones = createStones(delivery, stones)
  const engine = createEngine(matterStones)
  const world = engine.world
  while (!shouldStop(world.bodies)) {
    Events.trigger(engine, 'tick', { timestamp: engine.timing.timestamp })
    Engine.update(engine, engine.timing.delta)
    Events.trigger(engine, 'afterTick', { timestamp: engine.timing.timestamp })
  }
  return world.bodies.map(stoneToJson)
}

export { simulate, render, STONE_RADIUS, HOUSE_RADIUS }
