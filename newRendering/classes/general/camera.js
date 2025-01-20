class Camera {
    constructor(increments) {
        this.increments = increments

        this.rotations = new Vector3(0, 0, 0)
        this.listening = false
    }

    createTargets() {
        this.targetX = new Vector3(this.increments.x, 0, 0)
        this.targetY = new Vector3(0, this.increments.y, 0)
    }

    turnLeft() {
        this.rotations = this.rotations.vectorDifference(this.targetY)
    }

    turnRight() {
        this.rotations = this.rotations.vectorSum(this.targetY)
    }

    turnDown() {
        this.rotations = this.rotations.vectorDifference(this.targetX)
    }

    turnUp() {
        this.rotations = this.rotations.vectorSum(this.targetX)
    }
}