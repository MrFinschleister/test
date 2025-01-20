class GlobalManager {
    constructor() {
        this.canvas = canvas
        this.ctx = ctx
        this.origin = new Vector3(0, 0, 0)
        this.absoluteOrigin = this.origin.clone()
        this.fps = 60
        this.scalar = 500
        this.cameraIncrements = new Vector3(10, 10, 10)
        this.movementIncrements = new Vector3(10, 10, 10)
    }

    constructObjects() {
        this.camera = new Camera(this.cameraIncrements)
        this.movement = new Movement(this.movementIncrements)
        this.time = new GlobalTime(this.fps)
        this.renderComputer = new RenderComputer(this.scalar)
        this.renderer = new Renderer(this.canvas, this.ctx)
        this.controller = new Controller(document.body)
    }

    finalizeObjects() {
        this.camera.createTargets()
        this.movement.createTargets()
        this.controller.startListening()
        this.renderer.canvasSetup()
    }

    tick() {
        let start = performance.now()

        render()

        let end = performance.now()
        
        this.time.totalTime += end - this.time.timestamp
        this.time.currentTime += end - this.time.timestamp
        this.time.totalFrameTime += end - start
        this.time.currentFrameTime += end - start
        this.time.totalFrames++
        this.time.currentFrames++

        this.time.timestamp = end

        this.printData()
    }

    printData() {
        document.getElementById('timePerFrame').innerHTML = "Time per frame (ms): " + (this.time.currentFrameTime / this.time.currentFrames).toFixed(2)
        document.getElementById('framesPerSecond').innerHTML = "Frames per second: " + (this.time.totalFrames / (this.time.totalTime / 1000)).toFixed(2)
    }
}