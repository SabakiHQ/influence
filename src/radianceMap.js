const {hasVertex, getNeighbors, getChain} = require('./helper')

module.exports = function(data, sign, {p1 = 6, p2 = 1.5, p3 = 2} = {}) {
    let height = data.length
    let width = height === 0 ? 0 : data[0].length
    let map = [...Array(height)].map(_ => Array(width).fill(0))
    let size = [width, height]
    let done = {}

    let getMirroredVertex = v => {
        if (hasVertex(v, width, height)) return v
        return v.map((z, i) => z < 0 ? -z - 1 : z >= size[i] ? 2 * size[i] - z - 1 : z)
    }

    let castRadiance = chain => {
        let queue = chain.map(x => [x, 0])
        let visited = {}

        while (queue.length > 0) {
            let [v, d] = queue.shift()
            let [x, y] = getMirroredVertex(v)

            map[y][x] += !hasVertex(v, width, height) ? p3 : p2 / (d / p1 * 6 + 1)

            for (let n of getNeighbors(v)) {
                if (d + 1 > p1 || data[n[1]][n[0]] === -sign || n in visited)
                    continue

                visited[n] = true
                queue.push([n, d + 1])
            }
        }
    }

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let v = [x, y]
            if (data[y][x] !== sign || v in done) continue

            let chain = getChain(data, v)
            chain.forEach(w => done[w] = true)

            castRadiance(chain)
        }
    }

    return map
}
