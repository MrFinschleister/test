class Noise {
    constructor (seed, numMax, s, nA, aS, aV) {
        this.seed = seed
        this.numMax = numMax
        if (s == undefined) {
            this.s = 0
        } else {
            this.s = s
        }
        if (nA == undefined) {
            this.nA = 3
        } else {
            this.nA = nA
        }
        if (aS == undefined) {
            this.aS = 2
        } else {
            this.aS = aS
        }
        if (aV == undefined) {
            this.aV = false
        } else {
            this.aV = aV
        }
    }

    rand(seed) {
        let h1 = 1779033703, h2 = 3144134277,
            h3 = 1013904242, h4 = 2773480762

        for (let i = 0, k; i < seed.length; i++) {
            k = seed.charCodeAt(i)
            h1 = h2 ^ Math.imul(h1 ^ k, 597399067)
            h2 = h3 ^ Math.imul(h2 ^ k, 2869860233)
            h3 = h4 ^ Math.imul(h3 ^ k, 951274213)
            h4 = h1 ^ Math.imul(h4 ^ k, 2716044179)
        }
        h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067)
        h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233)
        h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213)
        h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179)
        h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1
        return (h1 >>> 0) / (h2 >>> 0) * (h3 >>> 0) / (h4 >>> 0)
    }

    adjustValue(num) {
        let a = (4 / (this.numMax ** 2)) * ((num - (this.numMax / 2)) ** 3) + (this.numMax / 2)

        let b = this.s * ((num - (this.numMax / 2)) ** 2) + (this.numMax / 2) + ((this.s * this.numMax) / 3)

        num = (a + b) / 2

        if (num < 0 || num > this.numMax || num == undefined) {
            num = this.numMax / 2
        }

        return num
    }

    generateNoise(x, y) {
        let num = this.rand((this.seed + x) + y) % this.numMax

        if (this.aV) {
            num = this.adjustValue(num)
        }

        return num
    }

    averageMap(map) {
        let maps = [map]

        for (let i = 0; i < this.nA; i++) {
            if (this.aS < 1) {
                break
            }

            maps.push([])
            let map1 = maps[i]
            let map2 = maps[i + 1]

            for (let y = 0; y < map1.length; y++) {
                for (let x = 0; x < map1[y].length; x++) {
                    let start = [y - this.aS, x - this.aS]
                    let end = [y + this.aS, x + this.aS]

                    if (start[0] < 0) {
                        start[0] = 0
                    } else if (start[0] >= map1.length) {
                        start[0] = map1.length - 1
                    }
                    if (start[1] < 0) {
                        start[1] = 0
                    } else if (start[1] >= map1[0].length) {
                        start[1] = map1[0].length - 1
                    }
                    if (end[0] < 0) {
                        end[0] = 0
                    } else if (end[0] >= map1.length) {
                        end[0] = map1.length - 1
                    }
                    if (end[1] < 0) {
                        end[1] = 0
                    } else if (end[1] >= map1[0].length) {
                        end[1] = map1[0].length - 1
                    }

                    let vals = 0

                    let avg = 0

                    for (let y1 = start[0]; y1 < end[0]; y1++) {
                        for (let x1 = start[1]; x1 < end[1]; x1++) {
                            vals++
                            avg += map1[y1][x1]
                        }
                    }

                    avg /= vals

                    if (!map2[y]) {
                        map2[y] = []
                    }

                    map2[y][x] = avg
                }
            }

            maps[i + 1] = map2
        }

        return maps[maps.length - 1]
    }

    constructMap(maxX, maxY, offX, offY, aM) {
        let map = []

        if (offX == undefined) {
            offX = 0
        }
        if (offY == undefined) {
            offY = 0
        }

        for (let y = 0; y < maxY; y++) {
            map[y] = []
            for (let x = 0; x < maxX; x++) {
                map[y][x] = this.generateNoise(x + offX, y + offY)
            }
        }

        if (aM || aM == undefined) {
            map = this.averageMap(map)
        }

        return map
    }
}