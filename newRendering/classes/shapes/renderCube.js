class Cube {
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
            new Vector3(this.loc.x + hDim.x, this.loc.y + hDim.y, this.loc.z - hDim.z),
            new Vector3(this.loc.x - hDim.x, this.loc.y + hDim.y, this.loc.z - hDim.z),
            new Vector3(this.loc.x - hDim.x, this.loc.y - hDim.y, this.loc.z + hDim.z),
            new Vector3(this.loc.x + hDim.x, this.loc.y - hDim.y, this.loc.z + hDim.z),
            new Vector3(this.loc.x + hDim.x, this.loc.y + hDim.y, this.loc.z + hDim.z),
            new Vector3(this.loc.x - hDim.x, this.loc.y + hDim.y, this.loc.z + hDim.z),
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
        let top = [this.p[0], this.p[1], this.p[2], this.p[3]]
        let bottom = [this.p[4], this.p[5], this.p[6], this.p[7]]

        let left = [this.p[0], this.p[1], this.p[5], this.p[4]]
        let right = [this.p[3], this.p[2], this.p[6], this.p[7]]

        let front = [this.p[1], this.p[5], this.p[6], this.p[2]]
        let back = [this.p[0], this.p[4], this.p[7], this.p[3]]

        this.faces = [top, bottom, left, right, front, back]
    }
    
    fullProcess() {
        this.constructPoints()
        this.adjustPoints()
        this.constructFaces()

        return this.faces
    }
}