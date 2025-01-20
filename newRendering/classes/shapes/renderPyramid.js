class Pyramid {
    constructor(obj) {
        this.loc = obj.location
        this.dim = obj.dimensions
        this.rot = obj.rotations
    }

    constructPoints() {
        let hDim = this.dim.scalarMultiplication(0.5)

        this.p = [
            new Vector3(this.loc.x - hDim.x, this.loc.y - hDim.y, this.loc.z - hDim.z),
            new Vector3(this.loc.x + hDim.x, this.loc.y - hDim.y, this.loc.z - hDim.z),
            new Vector3(this.loc.x + hDim.x, this.loc.y - hDim.y, this.loc.z + hDim.z),
            new Vector3(this.loc.x - hDim.x, this.loc.y - hDim.y, this.loc.z + hDim.z),
            new Vector3(this.loc.x, this.loc.y + hDim.y, this.loc.z),
        ]
    }

    adjustPoints() {
        let p = this.p

        for (let x = 0; x < p.length; x++) {
            let sel = p[x]

            sel = sel.rotateDeg(this.rot, this.loc)

            this.p[x] = sel
        }
    }

    constructFaces() {
        let bottom = [this.p[0], this.p[1], this.p[2], this.p[3]]

        let left = [this.p[0], this.p[1], this.p[4]]
        let right = [this.p[2], this.p[3], this.p[4]]

        let front = [this.p[1], this.p[2], this.p[4]]
        let back = [this.p[0], this.p[3], this.p[4]]

        this.faces = [bottom, left, right, front, back]
    }
    
    fullProcess() {
        this.constructPoints()
        this.adjustPoints()
        this.constructFaces()

        return this.faces
    }
}