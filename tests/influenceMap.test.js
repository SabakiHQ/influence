const t = require('tap')
const influence = require('..')
const data = require('./data')

t.test('should return same dimensions of input data', t => {
    let result = influence.map(data.unfinished)

    t.equal(data.unfinished.length, result.length)
    t.equal(data.unfinished[0].length, result[0].length)
    t.end()
})

t.test('should have same sign as stones on stone vertices', t => {
    let result = influence.map(data.unfinished)

    for (let y = 0; y < data.unfinished.length; y++) {
        for (let x = 0; x < data.unfinished[0].length; x++) {
            if (data.unfinished[y][x] === 0) continue
            t.equal(result[y][x], data.unfinished[y][x])
        }
    }

    t.end()
})

t.test('should return a number between -1 and 1', t => {
    let result = influence.map(data.unfinished)

    for (let y = 0; y < data.unfinished.length; y++) {
        for (let x = 0; x < data.unfinished[0].length; x++) {
            t.assert(-1 <= result[y][x])
            t.assert(result[y][x] <= 1)
        }
    }

    t.end()
})

t.test('should return -1, 0, 1 if discrete is set to true', t => {
    let result = influence.map(data.unfinished, {discrete: true})

    for (let y = 0; y < data.unfinished.length; y++) {
        for (let x = 0; x < data.unfinished[0].length; x++) {
            t.assert([-1, 0, 1].includes(result[y][x]))
        }
    }

    t.end()
})

t.test('a stone at 3 3 should control the corner', t => {
    let board = [...Array(19)].map(_ => Array(19).fill(0))
    board[2][2] = 1
    board[16][16] = -1

    let result = influence.map(board, {discrete: true})
    t.assert([[0, 0], [1, 0], [2, 0], [1, 1], [2, 1]].every(([x, y]) => result[y][x] === 1 && result[x][y] === 1))

    t.end()
})

t.test('should not have holes or single point areas', t => {
    let result = influence.map(data.middle, {discrete: true})

    for (let y = 0; y < data.middle.length; y++) {
        for (let x = 0; x < data.middle[0].length; x++) {
            if (data.middle[y][x] !== 0) continue

            let neighbors = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]
                .filter(([i, j]) => result[j] && result[j][i] != null)

            if (neighbors.length === 0) continue

            let sign = result[y][x] === 0 ? result[neighbors[0][1]][neighbors[0][0]] : 0

            if (result[y][x] === 0 && sign === 0) continue

            t.notDeepEqual(neighbors.map(([i, j]) => result[j][i]), neighbors.map(_ => sign))
        }
    }

    t.end()
})
