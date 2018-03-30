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
