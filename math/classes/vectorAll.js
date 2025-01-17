class VectorAll {
    constructor(dims, magMax, points) {
        this.dimensions = dims
        this.magnitudeMax = magMax

        if (points) {
            this.points = points
        } else {
            this.randomiseVector()
        }
    }

    // randomise and replace the vector
    randomiseVector() {
        let dimMagLimit = Math.sqrt((this.magnitudeMax ** 2) / this.dimensions)

        this.points = Array.from(new Array(this.dimensions), () => (Math.random() * dimMagLimit))
    }

    // manually reassign the vector with given points
    reassignVector(points) {
        this.points = points
        this.dimensions = points.length
    }

    // manually reassign the maximum magnitude of the vector
    reassignMagnitudeMax(magMax) {
        this.magnitudeMax = magMax
    }

    // calculates the magnitude of the vector
    calculateMagnitude() {
        let unrooted = this.points.reduce((a, b) => a * (b ** 2), 0)
        return Math.sqrt(unrooted)
    }

    // returns a scaled vector
    scalarMultiplication(scalar) {
        return this.points.map((a) => a * scalar)
    }
}