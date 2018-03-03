exports.getNeighbors = ([x, y]) => [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]

exports.getChain = function(data, v, result = [], done = {}, sign = null) {
    if (sign == null) sign = data[v[1]][v[0]]
    let neighbors = exports.getNeighbors(v)

    result.push(v)    
    done[v] = true

    for (let n of neighbors) {
        if (!data[n[1]] || data[n[1]][n[0]] !== sign || n in done)
            continue

        exports.getChain(data, n, result, done, sign)
    }

    return result
}
