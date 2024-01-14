module.exports = function (data, sign) {
    let height = data.length
    let width = height === 0 ? 0 : data[0].length
    let map = Array(height).fill(null).map(_ => Array(width).fill(Infinity))
    let min = Infinity

    let f = (x, y) => {
        if (data[y][x] === sign) min = 0
        else min++

        map[y][x] = min = Math.min(min, map[y][x])
    }

    for (let y = 0; y < height; y++) {
        min = Infinity

        for (let x = 0; x < width; x++) {
            let old = Infinity

            f(x, y)
            old = min

            for (let ny = y + 1; ny < height; ny++) f(x, ny)
            min = old

            for (let ny = y - 1; ny >= 0; ny--) f(x, ny)
            min = old
        }
    }

    for (let y = height - 1; y >= 0; y--) {
        min = Infinity

        for (let x = width - 1; x >= 0; x--) {
            let old = Infinity

            f(x, y)
            old = min

            for (let ny = y + 1; ny < height; ny++) f(x, ny)
            min = old

            for (let ny = y - 1; ny >= 0; ny--) f(x, ny)
            min = old
        }
    }

    return map
}
