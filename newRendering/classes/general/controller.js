class Controller {
    constructor(target) {
        this.target = target
        
        this.listening = false
    }

    startListening() {
        if (!this.listening) {
            this.target.addEventListener('keydown', this.keydown)
            this.listening = true
        }
    }

    stopListening() {
        this.target.removeEventListener('keydown', this.keydown)
        this.listening = false
    }

    keydown(e) {
        if (e.key == "ArrowLeft") {
            game.camera.turnLeft()
        } else if (e.key == "ArrowRight") {
            game.camera.turnRight()
        } else if (e.key == "ArrowDown") {
            game.camera.turnDown()
        } else if (e.key == "ArrowUp") {
            game.camera.turnUp()
        } else if (e.key == "W") {
            game.movement.moveForward()
        } else if (e.key == "S") {
            game.movement.moveBackward()
        } else if (e.key == "A") {
            game.movement.moveLeft()
        } else if (e.key == "D"){
            game.movement.moveRight()
        } else if (e.key == "Space") {
            game.movement.moveUp()
        } else if (e.key == "Shift") {
            game.movement.moveDown()
        }
    }
}