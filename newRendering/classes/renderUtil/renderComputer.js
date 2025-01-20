class RenderComputer {
    constructor(scalar) {
        this.scalar = scalar
    }

    scaleZ(v) {
        let mag = 1 - (0.5 / ((game.origin.z - v.z) / this.scalar))

        let vDiff = v.vectorDifference(game.origin)
        let off = vDiff.scalarMultiplication(1 / mag)

        let v1 = v.vectorDifference(off)
        v1.z = v.z

        return v1
    }
}