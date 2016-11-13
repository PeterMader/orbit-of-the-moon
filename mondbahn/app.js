/*
  Eine Simulation der Mondbahn bezogen auf die Erde.
  Peter Mader, 2016
*/

document.addEventListener('DOMContentLoaded', () => {

  const adjust = () => {
    let size = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight
    canvas.height = canvas.width = size
    canvas.style.left = (window.innerWidth - size) / 2 + 'px'
    canvas.style.top = (window.innerHeight - size) / 2 + 'px'
    CENTER_X = CENTER_Y = size / 2
    geometricSizes()
  }

  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')

  window.addEventListener('resize', adjust)

  const MOON_RADIUS = 5
  const EARTH_RADIUS = 20
  const MASS_PROPORTION = EARTH_RADIUS * EARTH_RADIUS / (MOON_RADIUS * MOON_RADIUS)

  const LARGE_SEMI_AXIS = 200
  const SMALL_SEMI_AXIS = 200
  let CENTER_X = 200
  let CENTER_Y = 200
  const GEOMETRIC_PROPORTION = LARGE_SEMI_AXIS / SMALL_SEMI_AXIS

  let GEOMETRIC_FOCUS = Math.sqrt(LARGE_SEMI_AXIS * LARGE_SEMI_AXIS - SMALL_SEMI_AXIS * SMALL_SEMI_AXIS) + CENTER_X

  let count = 0, velocity = 0

  const geometricSizes = () => {
    GEOMETRIC_FOCUS = Math.sqrt(LARGE_SEMI_AXIS * LARGE_SEMI_AXIS - SMALL_SEMI_AXIS * SMALL_SEMI_AXIS) + CENTER_X
  }

  const mainLoop = new Loop(() => {
    render()

    // The velocity must be proportional to MASS_PROPORTION and GEOMETRIC_PROPORTION
    velocity = Math.sin(count) * .001  * MASS_PROPORTION * (GEOMETRIC_PROPORTION - 1) + .03
    count += velocity
  })

  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    /* Draw the stats */
    ctx.fillStyle = "#FFFFFF"
    ctx.fillText('Große Halbachse: ' + LARGE_SEMI_AXIS, 20, 20)
    ctx.fillText('Kleine Halbachse: ' + SMALL_SEMI_AXIS, 20, 40)

    /* Draw the orbit of the moon */
    ctx.strokeStyle = '#DDDDDD'
    ctx.beginPath()
    ctx.ellipse(CENTER_X, CENTER_Y, LARGE_SEMI_AXIS, SMALL_SEMI_AXIS, 0, 0, 2 * Math.PI)
    ctx.stroke()

    /* Draw the moon */
    ctx.fillStyle = '#666666'
    let moonX = Math.sin(count) * LARGE_SEMI_AXIS
    let moonY = SMALL_SEMI_AXIS * Math.sqrt(1 - moonX * moonX / (LARGE_SEMI_AXIS * LARGE_SEMI_AXIS))
    if (Math.cos(count) < 0) {
      moonY = -moonY
    }
    ctx.beginPath()
    ctx.moveTo(moonX + CENTER_X, moonY + CENTER_Y - MOON_RADIUS)
    ctx.arc(moonX + CENTER_X, moonY + CENTER_Y, MOON_RADIUS, 0, Math.PI * 2, true)
    ctx.fill()

    /* Draw the earth */
    const deltaX = moonX + CENTER_X - GEOMETRIC_FOCUS
    const deltaY = moonY
    const earthX = GEOMETRIC_FOCUS - deltaX / MASS_PROPORTION
    const earthY = CENTER_Y - deltaY / MASS_PROPORTION
    ctx.fillStyle = '#0022FF'
    ctx.beginPath()
    ctx.moveTo(earthX, earthY - EARTH_RADIUS)
    ctx.arc(earthX, earthY, EARTH_RADIUS, 0, Math.PI * 2, true)
    ctx.fill()

    /* Draw the geometric focus */
    ctx.fillStyle = '#FF0000'
    ctx.beginPath()
    ctx.moveTo(GEOMETRIC_FOCUS, CENTER_Y - 2)
    ctx.arc(GEOMETRIC_FOCUS, CENTER_Y, 2, 0, Math.PI * 2, true)
    ctx.fill()
  }

  adjust()
  mainLoop.start()

})
