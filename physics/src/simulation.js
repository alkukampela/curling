import Matter from 'matter-js'
const { Engine, Render, World, Bodies, Body, Events, Vector } = Matter

const FRICTION = 0.1
const RADIUS = 35

const createStone = (x, y, team) => {
  const stone = Bodies.circle(x, y, RADIUS, { frictionAir: FRICTION })
  stone.team = team
  return stone
}

// TODO mathematics
const getVelocity = (speed, angle) => Vector.create(0, 10)

const createEngine = (delivery, stones) => {
    const stationary = stones.map(stone => createStone(...stone))
    const delivered = createStone(delivery.start_x, 0, delivery.team)
    Body.setVelocity(delivered, getVelocity(delivery.speed, delivery.angle))

    const engine = Engine.create()
    engine.world.gravity = Vector.create(0, 0)
    World.add(engine.world, [delivered, ...stationary])
    return engine
}

const simulate = (delivery, stones) => {
  // TODO simulate
  const engine = createEngine(delivery, stones)
  return { stones }
}

export default simulate