const areaMap = require('./areaMap')
const nearestNeighborMap = require('./nearestNeighborMap')
const radianceMap = require('./radianceMap')
const {getNeighbors} = require('./helper')

module.exports = function(data, {discrete = false, maxDistance = 6, minRadiance = 2} = {}) {
    let height = data.length
    let width = height === 0 ? 0 : data[0].length
    let map = areaMap(data)
    let pnnmap = nearestNeighborMap(data, 1)
    let nnnmap = nearestNeighborMap(data, -1)
    let prmap = radianceMap(data, 1)
    let nrmap = radianceMap(data, -1)

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (map[y][x] !== 0) continue

            let s = Math.sign(nnnmap[y][x] - pnnmap[y][x])
            let faraway = s === 0 || (s > 0 ? pnnmap : nnnmap)[y][x] > maxDistance
            let dim = s === 0 || Math.round((s > 0 ? prmap : nrmap)[y][x]) < minRadiance

            if (faraway || dim) map[y][x] = 0
            else map[y][x] = s * (s > 0 ? prmap[y][x] : nrmap[y][x])

            if (discrete) map[y][x] = Math.sign(map[y][x])
        }
    }

    // Postprocessing

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (data[y][x] !== 0) continue

            // Prevent single point areas

            let sign = Math.sign(map[y][x])

            if (sign !== 0) {
                let neighbors = getNeighbors([x, y])
                    .filter(([i, j]) => data[j] && data[j][i] != null)

                if (neighbors.length >= 2) {
                    let [i, j] = neighbors[0]

                    if (neighbors.every(([i, j]) => Math.sign(map[j][i]) !== sign)) {
                        map[y][x] = 0
                        continue
                    }
                }
            }

            // Fix ragged areas
            
            let distance = Math.min(x, y, width - x - 1, height - y - 1)

            if (sign !== 0) {
                let friendlyNeighbors = getNeighbors([x, y])
                    .filter(([i, j]) => map[j] && Math.sign(map[j][i]) === sign)

                if (friendlyNeighbors.length === 1) {
                    let [i, j] = friendlyNeighbors[0]

                    if (data[j][i] === sign) map[y][x] = 0
                    continue
                }
            }

            // Fix empty pillars

            if (distance <= 2 && sign === 0) {
                let signedNeighbors = getNeighbors([x, y])
                    .filter(([i, j]) => map[j] && map[j][i] !== 0)

                if (signedNeighbors.length >= 2) {
                    let [[i1, j1], [i2, j2]] = signedNeighbors
                    let s = Math.sign(map[j1][i1])

                    if ((signedNeighbors.length >= 3 || i1 === i2 || j1 === j2)
                    && signedNeighbors.every(([i, j]) => Math.sign(map[j][i]) === s)) {
                        map[y][x] = !discrete
                            ? signedNeighbors.reduce((sum, [i, j]) => sum + map[j][i], 0) / signedNeighbors.length
                            : s
                        continue
                    }
                }
            }
        }
    }

    return areaMap(map)
}
