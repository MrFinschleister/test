class Renderer {
    constructor(canvas, ctx) {
        this.canvas = canvas
        this.ctx = ctx

        this.renderQueue = []
    }

    canvasSetup() {
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2)
        this.ctx.scale(1, -1)
    }

    render() {
        for (let x = 0; x < this.renderQueue.length; x++) {
            this.polygon(this.renderQueue[x])
        }

        this.renderQueue = []
    }

    polygon(points) {
        let last = points[points.length - 1]

        this.ctx.beginPath()
        this.ctx.moveTo(last.x, last.y)

        for (let x = 0; x < points.length; x++) {
            let sel = points[x]
            this.ctx.lineTo(sel.x, sel.y)
        }

        this.ctx.stroke()
    }

    newObj(obj) {
        let type = obj.type
        let shape

        if (type == "cube") {
            shape = new Cube(obj)
        } else if (type == "pyramid") {
            shape = new Pyramid(obj)
        }

        let faces = shape.fullProcess()

        for (let f = 0; f < faces.length; f++) {
            for (let f1 = 0; f1 < faces[f].length; f1++) {
                let sel = faces[f][f1]

                sel = game.renderComputer.scaleZ(sel)
                sel = sel.rotateDeg(game.camera.rotations, game.origin)

                faces[f][f1] = sel
            }

            this.renderQueue.push(faces[f])
        } 
    }
}