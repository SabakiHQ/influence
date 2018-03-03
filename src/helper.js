exports.equals = v => w => w[0] === v[0] && w[1] === v[1]
exports.hasVertex = ([x, y], width, height) => x >= 0 && x < width && y >= 0 && y < height
exports.getNeighbors = ([x, y]) => [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]

exports.getChain = function(data, v, result = [], sign = null) {
    if (sign == null) sign = data[v[1]][v[0]]
    let neighbors = exports.getNeighbors(v)
    
    result.push(v)

    for (let n of neighbors) {
        if (!data[n[1]] || data[n[1]][n[0]] !== sign || result.some(exports.equals(n)))
            continue

        exports.getChain(data, n, result, sign)
    }

    return result
}
