import Matter from 'matter-js'
import R from 'ramda'
const { Engine, Render, World, Bodies, Body, Events, Vector, Bounds, Runner } = Matter

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
  min: { x: -SHEET_WIDTH / 2, y: -BUTTON_Y },
  max: { x: SHEET_WIDTH / 2, y: SHEET_HEIGHT - BUTTON_Y }
}
const MIN_SPEED = 0.01
const SIMULATION_STEP_MS = 1000 / 60

// FIXME rename angle to line, speed to weight
const getVelocity = (speed, angle) => {
  const vx = speed * Math.cos(angle * Math.PI / 180)
  const vy = -speed * Math.cos((90 - angle) * Math.PI / 180)
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

  const delivered = createStone(delivery.start_x, BOUNDS.max.y, 0, delivery.team, sprites)
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

const isFinished = engine => (
  engine.world.bodies.length === 0 || !engine.world.bodies.some(isMoving)
)

const simulate = (delivery, stones) => {
  const matterStones = createStones(delivery, stones)
  const engine = createEngine(matterStones)

  const runStep = engine => {
    Events.trigger(engine, 'tick', { timestamp: engine.timing.timestamp })
    Engine.update(engine, SIMULATION_STEP_MS)
    Events.trigger(engine, 'afterTick', { timestamp: engine.timing.timestamp })
    return engine
  }
  R.until(isFinished, runStep)(engine)

  return engine.world.bodies.map(stoneToJson)
}

const createRunner = () => {
  const runnerOptions = {
    isFixed: true,
    delta: SIMULATION_STEP_MS
  }
  return Runner.create(runnerOptions)
}

const createRenderer = (engine, element, background) => {
  const renderer = Render.create({
    element,
    engine,
    bounds: BOUNDS,
    options: {
      hasBounds: true,
      background,
      height: SHEET_HEIGHT,
      width: SHEET_WIDTH,
      wireframes: false
    }
  })

  return renderer
}

const renderSimulation = (delivery, stones, sprites, background, element) => {
  return new Promise(function(resolve, reject) {
    let t;

    const isEmpty = e => !e.hasChildNodes()
    const removeChild = element => {
      element.removeChild(element.firstChild)
      return element
    }
    R.unless(R.isEmpty, R.until(isEmpty, removeChild))(element)

    const matterStones = createStones(delivery, stones, sprites)
    const engine = createEngine(matterStones)
    const runner = createRunner()
    const renderer = createRenderer(engine, element, background)

    t = setTimeout(reject, 12000);

    Events.on(renderer, 'afterRender', () => {
      if (isFinished(engine)) {
        Render.stop(renderer);
        clearTimeout(t);
        resolve();
      }
    })

    Runner.run(runner, engine)
    Render.run(renderer)
  });
}

export { simulate, renderSimulation, STONE_RADIUS, HOUSE_RADIUS }
