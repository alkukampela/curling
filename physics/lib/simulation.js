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
const MIN_SPEED = 0.02
const SIMULATION_STEP_MS = 1000 / 60

const getVelocity = (weight, line) => {
  let vector = Vector.create(0, R.negate(weight));
  let angle = R.subtract(line, 90);
  return Vector.rotate(vector, R.divide(R.multiply(angle, Math.PI), 180));
}

const createStone = (x, y, angle, team, sprites, isDelivery) => {
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
  stone.isDelivery = isDelivery
  return stone
}

const createStationaryStones = (stones, sprites) => {
  return stones.map(s => createStone(s.x, 
                                     s.y, 
                                     s.angle, 
                                     s.team, 
                                     sprites,
                                     false))
}

const createStones = (delivery, stones, sprites) => {
  const stationary = createStationaryStones(stones, sprites)
  const delivered = createStone(0, 
                                BOUNDS.max.y, 
                                0, 
                                delivery.team, 
                                sprites,
                                true)
                      
  Body.setAngularVelocity(delivered, R.negate(delivery.curl))
  Body.setVelocity(delivered, getVelocity(delivery.weight, delivery.line))

  return [delivered, ...stationary]
}

const createEngine = matterStones => {
  const engine = Engine.create()
  engine.world.gravity = Vector.create(0, 0)

  World.add(engine.world, matterStones)
  Events.on(engine, 'afterUpdate', () => {
    applyCurl(engine)
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


const applyCurl  = engine => {
  const deliveree = engine.world.bodies.find(x => x.isDelivery === true)
  if (!deliveree || deliveree.speed < MIN_SPEED){
    return
  }
  const baseVector = deliveree.velocity;
  // Base scaling is based on the amount of curl in the stone
  let scaledVector = Vector.mult(baseVector, Math.abs(deliveree.angularVelocity) / 2000)
  // Add some bonus scaling that increments towards the end
  scaledVector = Vector.mult(scaledVector, Math.log(1/deliveree.speed + Math.E))
  const directionAngle = Math.sign(deliveree.angularVelocity) * 0.5 * Math.PI
  const directedVector = Vector.rotate(scaledVector, directionAngle)

  Body.applyForce(deliveree, deliveree.position, directedVector)
}

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

const removeElementsChildren = (element) => {
    const isEmpty = e => !e.hasChildNodes()
    const removeChild = element => {
      element.removeChild(element.firstChild)
      return element
    }
    R.unless(R.isEmpty, R.until(isEmpty, removeChild))(element)
}

const renderSimulation = (delivery, stones, sprites, background, element) => {
  return new Promise((resolve, reject) => {
    let failTimeout;
    removeElementsChildren(element)

    const matterStones = createStones(delivery, stones, sprites)
    const engine = createEngine(matterStones)
    const runner = createRunner()
    const renderer = createRenderer(engine, element, background)

    failTimeout = setTimeout(reject, 12000);

    Events.on(renderer, 'afterRender', () => {
      
      if (isFinished(engine)) {
        Render.stop(renderer);
        clearTimeout(failTimeout);
        resolve();
      }
    })

    Runner.run(runner, engine)
    Render.run(renderer)
  })
}

const renderStationary = (stones, sprites, background, element) => {
    removeElementsChildren(element)

    const matterStones = createStationaryStones(stones, sprites)
    const engine = createEngine(matterStones)
    const renderer = createRenderer(engine, element, background)

    //Runner.run(runner, engine)
    Render.run(renderer)
}

export { simulate, renderSimulation, renderStationary, STONE_RADIUS, HOUSE_RADIUS }
