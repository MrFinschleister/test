// Vector3 is a class to define 3 dimensional coordinate vectors
// The values of these dimensions can either be manually provided or randomly assigned
class Vector3 {
    constructor(x, y, z) {
        this.x = x || 0
        this.y = y || 0
        this.z = z || 0

        this.dimensions = 3
    }

    // manually reassign the vector
    reassignVector(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }

    // return the value of the vector
    getVector() {
        return [this.x, this.y, this.z]
    }

    // clones the vector
    clone() {
        return new Vector3(this.x, this.y, this.z)
    }

    // randomise the vector's values with a provided maximum magnitude
    randomiseVector(magnitude) {
        let magnitudeMax = Math.sqrt((magnitude ** 2) / 3)
        this.x = ((Math.random() * magnitudeMax * 2) - magnitudeMax).toFixed(3)
        this.y = ((Math.random() * magnitudeMax * 2) - magnitudeMax).toFixed(3)
        this.z = ((Math.random() * magnitudeMax * 2) - magnitudeMax).toFixed(3)
    }

    // return the magnitude of the vector
    getMagnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2)
    }

    // return a scaled vector
    scalarMultiplication(scalar) {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar)
    }

    // return the sum of the current vector and a provided one
    vectorSum(v2) {
        if (!v2.dimensions == this.dimensions) {
            throw new Error("Invalid vector dimensions.")
        }

        return new Vector3(this.x + v2.x, this.y + v2.y, this.z + v2.z)
    }

    // return the different of the current vetor and a provided one
    vectorDifference(v2) {
        if (!v2.dimensions == this.dimensions) {
            throw new Error("Invalid vector dimensions.")
        }

        return new Vector3(this.x - v2.x, this.y - v2.y, this.z - v2.z)
    }

    // rotate the vector about an origin point in degree measurements
    rotateDeg(deg, origin) {
        let rad = deg.scalarMultiplication(Math.PI / 180)
        return this.rotateRad(rad, origin)
    }

    // rotate the vector about an origin point in radian measurements
    rotateRad(rad, origin) {
        return this.rotateX(rad.x, origin).rotateY(rad.y, origin).rotateZ(rad.z, origin)
    }

    // rotate the vector about an origin point on the X axis
    rotateX(rad, origin) {
        let sinDeg = Math.sin(rad)
        let cosDeg = Math.cos(rad)

        let v1 = this.clone()
        let v2 = v1.vectorDifference(origin)

        v1.y = v2.y * cosDeg - v2.z * sinDeg
        v1.z = v2.z * cosDeg + v2.y * sinDeg

        return v1.vectorSum(origin)
    }

    // rotate the vector about an origin point on the Y axis
    rotateY(rad, origin) {
        let sinDeg = Math.sin(rad)
        let cosDeg = Math.cos(rad)

        let v1 = this.clone()
        let v2 = v1.vectorDifference(origin)

        v1.x = v2.x * cosDeg - v2.z * sinDeg
        v1.z = v2.z * cosDeg + v2.x * sinDeg

        return v1.vectorSum(origin)
    }

    // rotate the vector about an origin point on the Z axis
    rotateZ(rad, origin) {
        let sinDeg = Math.sin(rad)
        let cosDeg = Math.cos(rad)

        let v1 = this.clone()
        let v2 = v1.vectorDifference(origin)

        v1.x = v2.x * cosDeg - v2.y * sinDeg
        v1.y = v2.y * cosDeg + v2.x * sinDeg

        return v1.vectorSum(origin)
    }
}