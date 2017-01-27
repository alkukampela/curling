import Matter from 'matter-js'
const { Engine, Render, World, Bodies, Body, Events, Vector, Bounds } = Matter

const FRICTION = 0.015
const RESTITUTION = 0.1

const STONE_RADIUS = 31
const HOUSE_RADIUS = 245
const SHEET_WIDTH = 820
const SHEET_HEIGHT = 2460
const BUTTON_Y = 498

// Stones out of bounds are removed from the sheet.
// The simulation is stopped when there are either no stones
// inside bounds or all the stones are slower than MIN_SPEED.
const BOUNDS = {
  min: { x: -SHEET_WIDTH/2, y: -BUTTON_Y },
  max: { x: SHEET_WIDTH/2, y: SHEET_HEIGHT-BUTTON_Y }
}
const MIN_SPEED = 0.01

// FIXME rename angle to line, speed to weight
const getVelocity = (speed, angle) => {
  const vx = speed * Math.cos(angle * Math.PI/180)
  const vy = -speed * Math.cos((90 - angle) * Math.PI/180)
  return Vector.create(vx, vy)
}

const createStone = (x, y, angle, team, sprites) => {
  const options = {
    frictionAir: FRICTION,
    restitution: RESTITUTION,
    angle
  }
  if (sprites !== undefined) {
    options.render = {
      sprite: {
        texture: sprites[team]
      }
    }
  }
  const stone = Bodies.circle(x, y, STONE_RADIUS, options)
  stone.team = team
  return stone
}

const createStones = (delivery, stones, sprites) => {
  const stationary = stones.map(s => createStone(s.x, s.y, s.angle, s.team, sprites))
  const delivered = createStone(delivery.start_x,
                                BOUNDS.max.y,
                                0,
                                delivery.team,
                                sprites)
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
  const angle = stone.angle
  return { x, y, team, angle }
}

const isOutOfBounds = stone => !Bounds.overlaps(stone.bounds, BOUNDS)
const isMoving = stone => Vector.magnitude(stone.velocity) > MIN_SPEED
const shouldStop = stones => stones.length == 0 || !stones.some(isMoving)

const simulate = (delivery, stones) => {
  const matterStones = createStones(delivery, stones)
  const engine = createEngine(matterStones)
  const world = engine.world

  // URGENT FIXME use ramda
  while (!shouldStop(world.bodies)) {
    Events.trigger(engine, 'tick', { timestamp: engine.timing.timestamp })
    Engine.update(engine, engine.timing.delta)
    Events.trigger(engine, 'afterTick', { timestamp: engine.timing.timestamp })
  }

  return world.bodies.map(stoneToJson)
}

const renderSimulation = (delivery, stones, sprites, background, element) => {
  // Clear the element of potential previous renders
  // URGENT URGENT URGENT FIXME use ramda
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }

  const matterStones = createStones(delivery, stones, sprites)
  const engine = createEngine(matterStones)

  const renderer = Render.create({
    element,
    engine,
    bounds: BOUNDS,
    options: {
      hasBounds: true,
      background: background,
      height: SHEET_HEIGHT,
      width: SHEET_WIDTH,
      wireframes: false
    }
  })

  Events.on(renderer, 'afterRender', () => {
    if (shouldStop(engine.world.bodies)) {
      Render.stop(renderer)
    }
  })

  Engine.run(engine)
  Render.run(renderer)
}

export { simulate, renderSimulation, STONE_RADIUS, HOUSE_RADIUS }
