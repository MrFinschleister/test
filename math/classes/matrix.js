// Matrix is a class adjacent to arrays to define matrices
// The values can be imported as an entire 2 dimensional array, or inserted individually
class Matrix {
    constructor(width, height, matrix) {
        this.width = width
        this.height = height

        if (matrix) {
            this.matrix = matrix
            this.constructData()
        } else {
            this.constructMatrix()
        }
    }

    // assign width and height data from the matrix
    constructData() {
        this.width = this.matrix[0].length
        this.height = this.matrix.length
    }

    // construct the basic matrix skeleton
    constructMatrix() {
        this.matrix = new Array(this.height).fill([]).map((a) => new Array(this.width).fill(0))
    }

    // manually reassign the matrix
    reassignMatrix(matrix) {
        this.matrix = matrix
        this.constructData()
    }

    // clones the matrix
    clone() {
        return new Matrix(0, 0, this.matrix)
    }

    // insert a value into a specified location in the matrix
    insertValue(x, y, value) {
        this.matrix[y][x] = value
    }

    // return a value from within the matrix
    getValue(x, y) {
        return this.matrix[y][x]
    }

    // return a row from within the matrix
    getRow(row) {
        return this.matrix[row]
    }

    // return a column from within the matrix
    getColumn(column) {
        return this.matrix.map((a) => [a[column]])
    }

    // return a transposed matrix
    transpose() {
        let newMatrix = new Matrix(this.height, this.width)

        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                newMatrix.insertValue(y, x, this.matrix[y][x])
            }
        }

        return newMatrix
    }

    // return a scaled matrix
    scalarMultiplication(scalar) {
        let newMatrix = new Matrix(this.width, this.height)

        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                newMatrix.insertValue(x, y, this.matrix[y][x] * scalar)
            }
        }

        return newMatrix
    }
}