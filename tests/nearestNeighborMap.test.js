const t = require('tap')
const influence = require('..')
const data = require('./data')

t.test('should return same dimensions of input data', t => {
    let result = influence.nearestNeighborMap(data.unfinished, 1)

    t.assert(data.unfinished.length, result.length)
    t.assert(data.unfinished[0].length, result[0].length)
    t.end()
})
