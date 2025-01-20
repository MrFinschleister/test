class GlobalTime {
    constructor(fps) {
        this.fps = fps

        this.totalTime = 0
        this.currentTime = 0

        this.totalFrameTime = 0
        this.currentFrameTime = 0

        this.totalFrames = 0
        this.currentFrames = 0

        this.timestamp = 0
    }

    start() {
        this.timestamp = performance.now()

        this.interval = setInterval(function() {
            try {
                game.tick()
            } catch (error) {
                alert(error.stack)
            }
        }, 1000 / this.fps)
    }

    stop() {
        this.currentTime = 0
        this.currentFrameTime = 0
        this.currentFrames = 0

        clearInterval(this.interval)
    }
}