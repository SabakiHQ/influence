const {getChain, getNeighbors} = require('./helper')

module.exports = function(data) {
    let height = data.length
    let width = height === 0 ? 0 : data[0].length
    let map = [...Array(height)].map(_ => Array(width).fill(null))

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let vertex = [x, y]

            if (map[y][x] !== null) continue
            if (data[y][x] !== 0) {
                map[y][x] = data[y][x]
                continue
            }

            let chain = getChain(data, vertex)
            let sign = 0
            let indicator = 1

            for (let c of chain) {
                if (indicator === 0) break

                for (let n of getNeighbors(c)) {
                    let [nx, ny] = n
                    if (!data[ny] || data[ny][nx] == null || data[ny][nx] === 0) continue

                    if (sign === 0) {
                        sign = data[ny][nx]
                    } else if (sign !== data[ny][nx]) {
                        indicator = 0
                        break
                    }
                }
            }

            for (let [cx, cy] of chain) {
                map[cy][cx] = sign * indicator
            }
        }
    }

    return map
}
