// Vector3Computer is a class to handle operations between two vectors
// The provided vectors must be 3 dimensional
class Vector3Computer {
    constructor(v1, v2) {
        this.dimensions = 3

        if (v1.dimensions != this.dimensions || v2.dimensions != this.dimensions) {
            throw new Error("Invalid vector dimensions.")
        }

        this.v1 = v1.clone()
        this.v2 = v2.clone()

        this.constructData()
    }

    // assign coordinate data from vectors
    constructData() {
        this.x1 = this.v1.x
        this.y1 = this.v1.y
        this.z1 = this.v1.z

        this.x2 = this.v2.x
        this.y2 = this.v2.y
        this.z2 = this.v2.z
    }

    // manually reassign vector 1
    reassignVector1(v1) {
        if (v1.dimensions != this.dimensions) {
            return "Invalid vector dimensions"
        }

        this.v1 = v1.clone()

        this.constructData()
    }

    // manually reassign vector 2
    reassignVector2(v2) {
        if (v2.dimensions != this.dimensions) {
            throw new Error("Invalid vector dimensions")
        }

        this.v2 = v2.clone()

        this.constructData()
    }

    // return vector 1
    getVector1() {
        return this.v1
    }

    // return vector 2
    getVector2() {
        return this.v2
    }

    // return the dot product of vector 1 and vector 2
    dotProduct() {
        return (this.x1 * this.x2) + (this.y1 * this.y2) + (this.z1 * this.z2)
    }

    // return the cross product of vector 1 and vector 2
    crossProduct() {
        let x = (this.y1 * this.z2) - (this.z1 * this.y2)
        let y = (this.z1 * this.x2) - (this.x1 * this.z2)
        let z = (this.x1 * this.y2) - (this.y1 * this.x2)

        return new Vector3(x, y, z)
    }
}