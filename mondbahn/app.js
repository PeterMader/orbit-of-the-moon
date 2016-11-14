/*
  Eine Simulation der Mondbahn bezogen auf die Erde.
  Peter Mader, 2016

  Parameter, die vom Nutzer abgefragt werden:
    a: Große Halbachse
    b: Kleine Halbachse
    M: Masse der Erde (cube(Radius der Erde))
    m: Masse des Mondes (cube(Radius des Mondes))
  Pro Frame errechnete Parameter:
    r: Abstand von Mond und Erde
  Exzentrität: exz: exz(x) = sqrt(a*a - b*b)
  Ellipsenfunktion: ell: ell(x) = b * sqrt(1 - x*x / a*a)
  Bahngeschwindigkeit: vel: vel(x) = sqrt((M + m) * (2 / r + 1 / a))
*/

document.addEventListener('DOMContentLoaded', () => {

  // Passt den Canvas an die Bildschirmgröße an
  const adjust = () => {
    size = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight
    canvas.height = canvas.width = size
    canvas.style.left = (window.innerWidth - size) / 2 + 'px'
    canvas.style.top = (window.innerHeight - size) / 2 + 'px'
    CENTER_X = CENTER_Y = size / 2
    geometricSizes()
  }

  // Ermittle die Output-Elemente
  const output = {
    vel: document.getElementById('output-vel'), // Bahngeschwindigkeit des Mondes
    ex: document.getElementById('output-ex'),   // Exzentrität
    fps: document.getElementById('output-fps')  // Frame rate
  }

  // Ermittle die Input-Elemente
  const input = {
    lsa: document.getElementById('input-lsa'),
    ssa: document.getElementById('input-ssa'),
    rm: document.getElementById('input-rm'),
    re: document.getElementById('input-re')
  }

  const cube = (n) => n * n * n

  // Ermittle Canvas und Kontext
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')

  window.addEventListener('resize', adjust)

  let MOON_RADIUS = 5
  let EARTH_RADIUS = 20
  let MASS_MOON = 1
  let MASS_EARTH = 1
  let MASS_PROPORTION = 1

  let LARGE_SEMI_AXIS = 200
  let SMALL_SEMI_AXIS = 150
  let CENTER_X = 200
  let CENTER_Y = 200
  let GEOMETRIC_PROPORTION = LARGE_SEMI_AXIS / SMALL_SEMI_AXIS

  let GEOMETRIC_FOCUS = 0

  let lastFrame = Date.now(), fps = 0, size = 0

  let count = 0, velocity = 0, moonX = 0, moonY = 0, deltaX = 0, deltaY = 0, distance = 0

  const geometricSizes = () => {
    GEOMETRIC_FOCUS = Math.sqrt(LARGE_SEMI_AXIS * LARGE_SEMI_AXIS - SMALL_SEMI_AXIS * SMALL_SEMI_AXIS)
    MASS_MOON = cube(MOON_RADIUS)
    MASS_EARTH = cube(EARTH_RADIUS)
    MASS_PROPORTION = MASS_EARTH / MASS_MOON
  }

  const mainLoop = new Loop(() => {
    const now = Date.now()
    fps = 1000 / (now - lastFrame)
    lastFrame = now
    render()

    deltaX = moonX - GEOMETRIC_FOCUS
    deltaY = moonY
    distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    velocity = Math.sqrt((MASS_EARTH + MASS_MOON) * (2 / distance + 1 / LARGE_SEMI_AXIS)) * .003
    count += velocity
  })

  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    /* Output befüllen */
    output.vel.textContent = velocity.toFixed(4)
    output.ex.textContent = GEOMETRIC_FOCUS.toFixed(2)
    output.fps.textContent = fps.toFixed(0)

    /* Mondbahn zeichnen */
    ctx.strokeStyle = '#444444'
    ctx.beginPath()
    ctx.ellipse(CENTER_X, CENTER_Y, LARGE_SEMI_AXIS, SMALL_SEMI_AXIS, 0, 0, 2 * Math.PI)
    ctx.stroke()

    /* Mond zeichnen */
    ctx.fillStyle = '#999999'
    moonX = Math.sin(count) * LARGE_SEMI_AXIS
    moonY = SMALL_SEMI_AXIS * Math.sqrt(1 - moonX * moonX / (LARGE_SEMI_AXIS * LARGE_SEMI_AXIS))
    if (Math.cos(count) < 0) {
      moonY = -moonY
    }
    ctx.beginPath()
    ctx.moveTo(moonX + CENTER_X, moonY + CENTER_Y - MOON_RADIUS)
    ctx.arc(moonX + CENTER_X, moonY + CENTER_Y, MOON_RADIUS, 0, Math.PI * 2, true)
    ctx.fill()

    /* Erde zeichnen */
    const earthX = GEOMETRIC_FOCUS - deltaX / MASS_PROPORTION + CENTER_X
    const earthY = CENTER_Y - deltaY / MASS_PROPORTION
    ctx.fillStyle = '#0022FF'
    ctx.beginPath()
    ctx.moveTo(earthX, earthY - EARTH_RADIUS)
    ctx.arc(earthX, earthY, EARTH_RADIUS, 0, Math.PI * 2, true)
    ctx.fill()

    /* Brennpunkt zeichnen */
    ctx.fillStyle = '#FF0000'
    ctx.beginPath()
    ctx.moveTo(GEOMETRIC_FOCUS + CENTER_X, CENTER_Y - 2)
    ctx.arc(GEOMETRIC_FOCUS + CENTER_X, CENTER_Y, 2, 0, Math.PI * 2, true)
    ctx.fill()
  }

  adjust()
  mainLoop.start()
  mainLoop.pause()

  canvas.addEventListener('click', () => {
    mainLoop.togglePause()
  })

  document.getElementById('commit').addEventListener('click', () => {
    if (input.lsa.validity.valid  && input.lsa.value &&
      input.ssa.validity.valid  && input.ssa.value &&
      input.rm.validity.valid  && input.rm.value &&
      input.re.validity.valid && input.re.value) {
        if (parseInt(input.lsa.value) < parseInt(input.ssa.value)) {
          return
        }
        LARGE_SEMI_AXIS = parseInt(input.lsa.value)
        SMALL_SEMI_AXIS = parseInt(input.ssa.value)
        MOON_RADIUS = parseInt(input.rm.value)
        EARTH_RADIUS = parseInt(input.re.value)
        count = velocity = moonX = moonY = deltaX = deltaY = distance = 0
        geometricSizes()
        mainLoop.unpause()
      }
  })

  // Die Input-Elemente mit den Werten befüllen, die zu Anfang angezeigt werden
  // sollen
  input.lsa.value = LARGE_SEMI_AXIS
  input.ssa.value = SMALL_SEMI_AXIS
  input.rm.value = MOON_RADIUS
  input.re.value = EARTH_RADIUS

})
