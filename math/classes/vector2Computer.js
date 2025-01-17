// Vector2Computer is a class to handle operations between two vectors
// The provided vectors must be 2 dimensional
class Vector2Computer {
    constructor(v1, v2) {
        this.dimensions = 2

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

        this.x2 = this.v2.x
        this.y2 = this.v2.y
    }

    // manually reassign vector 1
    reassignVector1(v1) {
        if (v1.dimensions != this.dimensions) {
            throw new Error("Invalid vector dimensions.")
        }

        this.v1 = v1.clone()

        this.constructData()
    }

    // manually reassign vector 2
    reassignVector2(v2) {
        if (v2.dimensions != this.dimensions) {
            throw new Error("Invalid vector dimensions.")
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
        return (this.x1 * this.x2) + (this.y1 * this.y2)
    }
}