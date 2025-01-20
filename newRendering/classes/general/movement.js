class Movement {
    constructor(speed) {
        this.speed = speed
    }
    
    createTargets() {
        this.targetX = new Vector3(this.speed.x, 0, 0)
        this.targetY = new Vector3(0, this.speed.y, 0)
        this.targetZ = new Vector3(0, 0, this.speed.z)
    }

    moveForward() {
        game.origin = game.origin.vectorSum(this.targetZ.rotateDeg(game.camera.rotations, game.origin))
    }

    moveBackward() {
        game.origin = game.origin.vectorDifference(this.targetZ.rotateDeg(game.camera.rotations, game.origin))
    }

    moveLeft() {
        game.origin = game.origin.vectorDifference(this.targetX.rotateDeg(game.camera.rotations, game.origin))
    }

    moveRight() {
        game.origin = game.origin.vectorSum(this.targetX.rotateDeg(game.camera.rotations, game.origin))
    }

    moveUp() {
        game.origin = game.origin.vectorSum(this.targetY.rotateDeg(game.camera.rotations, game.origin))
    }

    moveDown() {
        game.origin = game.origin.vectorDifference(this.targetY.rotateDeg(game.camera.rotations, game.origin))
    }
}