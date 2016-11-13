class Loop {
  constructor (callback, interval) {
    this.running = false
    this.started = false
    this.stopped = false
    this.interval = typeof interval === 'number' && interval > 0 ? interval : null

    const loop = () => {
      if (this.running) {
        callback()
      }

      if (this.interval) {
        window.setTimeout(loop, this.interval)
      } else {
        window.requestAnimationFrame(loop)
      }
    }

    loop()
  }

  start () {
    if (this.stopped) {
      return false
    }
    this.running = true
    this.started = true
    return true
  }

  pause () {
    this.running = false
    return true
  }

  unpause () {
    return this.stopped && (this.running = true)
  }

  stop () {
    this.running = false
    this.stopped = true
    return true
  }
}
