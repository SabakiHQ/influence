const t = require('tap')
const influence = require('..')
const data = require('./data')

t.test('should return same dimensions of input data', t => {
    let result = influence.nearestNeighborMap(data.unfinished, 1)

    t.equal(data.unfinished.length, result.length)
    t.equal(data.unfinished[0].length, result[0].length)
    t.end()
})

t.test('only stone positions of the same color should have value 0', t => {
    let sign = -1
    let result = influence.nearestNeighborMap(data.unfinished, sign)

    for (let y = 0; y < data.unfinished.length; y++) {
        for (let x = 0; x < data.unfinished[0].length; x++) {
            if (data.unfinished[y][x] === sign) {
                t.equal(result[y][x], 0)
            } else {
                t.notEqual(result[y][x], 0)
            }
        }
    }

    t.end()
})
