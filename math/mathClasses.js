class Vector {
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

class VectorComputer {
    constructor(v1, v2) {
        this.v1 = new Vector(v1.dimensions, v1.magnitudeMax, v1.points)
        this.v2 = new Vector(v2.dimensions, v2.magnitudeMax, v2.points)

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

        let v = new Vector(this.dimensions, 0)
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

class Matrix {
    constructor(w, h, matrix) {
        this.width = w
        this.height = h

        if (matrix) {
            this.matrix = matrix
        } else {
            this.constructMatrix()
        }
    }

    // constructs the basic matrix skeleton
    constructMatrix() {
        let matrix = []

        for (let y = 0; y < this.height; y++) {
            matrix[y] = []
            for (let x = 0; x < this.width; x++) {
                matrix[y][x] = 0
            }
        }

        this.matrix = matrix
    }

    // manually reassign the matrix
    reassignMatrix(matrix) {
        this.matrix = matrix
    }

    // inserts a value into a specified location in the matrix
    insertValue(x, y, value) {
        this.matrix[y][x] = value
    }

    // return a value from within the matrix
    returnValue(x, y) {
        return this.matrix[y][x]
    }

    // returns a row from within the matrix
    returnRow(row) {
        return this.matrix[row]
    }

    // returns a column from within the matrix
    returnColumn(column) {
        return this.matrix.map((a) => a[column])
    }

    // return a transposed matrix
    transpose() {
        let newMatrix = new Matrix(this.height, this.width)

        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                newMatrix.insertValue(y, x, this.matrix[y][x])
            }
        }

        return newMatrix.matrix
    }

    // return a scaled matrix
    scalarMultiplication(scalar) {
        let newMatrix = new Matrix(this.width, this.height)

        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                newMatrix.insertValue(x, y, this.matrix[y][x] * scalar)
            }
        }

        return newMatrix.matrix
    }
}