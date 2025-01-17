class VectorAllComputer {
    constructor(v1, v2) {
        this.v1 = new VectorAll(v1.dimensions, v1.magnitudeMax, v1.points)
        this.v2 = new VectorAll(v2.dimensions, v2.magnitudeMax, v2.points)

        this.constructData()
    }

    // constructs additional VectorComputer information
    constructData() {
        this.p1 = this.v1.points
        this.p2 = this.v2.points

        this.dimensions = this.v1.dimensions

        this.magnitudeMax = Math.min(this.v1.magnitudeMax, this.v2.magnitudeMax)
    }

    // manually reassign a vector wtihin the 
    reassignVector(num, vector) {
        if (num <= 1) {
            this.v1 = vector 
        } else {
            this.v2 = vector
        }

        this.constructData()
    }

    // returns a specified vector
    returnVector(num) {
        return num <= 1 ? v1 : v2
    }

    // calculates the vector sum of the two vectors
    vectorSum() {
        return this.p1.map((a, i) => a + this.p2[i])
    }

    // calculates the difference of the two vectors
    vectorDifference(startVec) {
        let p1 = startVec <= 1 ? this.p1 : this.p2
        let p2 = startVec <= 1 ? this.p2 : this.p1

        return p1.map((a, i) => a + p2[i])
    }

    // calculates the dot product of the two vectors
    dotProduct() {
        let unsummed = this.p1.map((a, i) => a * this.p2[i])
        return unsummed.reduce((a, b) => a + b, 0)
    }

    // calculates the cross product of the two vectors
    crossProduct() {
        if (this.dimensions !== 3) {
            return false
        }

        let a = (this.p1[1] * this.p2[2]) - (this.p1[2] * this.p2[1])
        let b = (this.p1[2] * this.p2[0]) - (this.p1[0] * this.p2[2])
        let c = (this.p1[0] * this.p2[1]) - (this.p1[1] * this.p2[0])

        let v = new VectorAll(this.dimensions, 0)
        v.reassignVector([a, b, c])
        v.reassignMagnitudeMax(v.calculateMagnitude())

        return v
    }

    // returns the matrix
    matrixShift(matrix) {
        if (matrix.matrix.length < this.dimensions) {
            return false
        }

        let s1 = matrix.getColumn(0)
        let s2 = matrix.getColumn(1)

        let shift = new Array(this.dimensions).fill(0)

        for (let x = 0; x < this.dimensions; x++) {
            shift[x] += (s1[x] - this.p1[x]) + (s2[x] - this.p2[x])
        }

        return shift
    }
}