// Vector2 is a class to define 2 dimensional coordinate vectors
// The values of these dimensions can either be manually provided or randomly assigned
class Vector2 {
    constructor(x, y) {
        this.x = x || 0
        this.y = y || 0

        this.dimensions = 2
    }

    // manually reassign the vector
    reassignVector(x, y) {
        this.x = x
        this.y = y
    }

    // return the value of the vector
    getVector() {
        return [this.x, this.y]
    }

    // clones the vector
    clone() {
        return new Vector2(this.x, this.y)
    }

    // randomise the vector's values with a provided maximum magnitude
    randomiseVector(magnitude) {
        let magnitudeMax = Math.sqrt((magnitude ** 2) / 2)
        this.x = ((Math.random() * magnitudeMax * 2) - magnitudeMax).toFixed(3)
        this.y = ((Math.random() * magnitudeMax * 2) - magnitudeMax).toFixed(3)
    }

    // return the magnitude of the vector
    getMagnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2)
    }

    // return a scaled vector
    scalarMultiplication(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar)
    }

    // return the sum of the current vector and a provided one
    vectorSum(v2) {
        if (!v2.dimensions == this.dimensions) {
            throw new Error("Invalid vector dimensions.")
        }

        return new Vector2(this.x + v2.x, this.y + v2.y)
    }

    // return the different of the current vetor and a provided one
    vectorDifference(v2) {
        if (!v2.dimensions == this.dimensions) {
            throw new Error("Invalid vector dimensions.")
        }

        return new Vector2(this.x - v2.x, this.y - v2.y)
    }
}