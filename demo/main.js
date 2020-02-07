import {h, render, Component} from 'preact'
import {Goban} from '@sabaki/shudan'
import * as influence from '..'

const originalSignMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, -1, 0, 1, -1, 0, 0],
    [0, 1, -1, 0, 0, 0, 0, -1, -1, 1, 0, 1, -1, 0, 1, -1, 1, 1, 0],
    [0, 1, 1, -1, 0, 0, 0, 1, -1, -1, 1, 1, -1, -1, -1, -1, -1, 1, 0],
    [0, 1, -1, -1, 0, 0, 0, 0, 0, 0, -1, 1, 0, 1, -1, -1, 1, -1, 0],
    [0, 0, 0, 0, -1, 0, 0, 1, 0, 1, -1, 1, 1, -1, -1, 1, 0, 1, 0],
    [0, 1, 1, 1, -1, 0, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, -1, 0],
    [0, 1, -1, 1, -1, 0, 0, 0, 0, 0, 0, -1, 0, -1, 0, -1, 1, 0, 0],
    [0, 1, -1, -1, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, -1, 0, 0, 0, 0],
    [0, -1, -1, -1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, -1, -1, 1, 0],
    [0, 0, -1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, -1, -1, 1],
    [0, 0, -1, 1, 0, 0, 0, 0, 0, -1, -1, -1, -1, 0, 1, -1, -1, 1, 0],
    [0, 0, 1, -1, -1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1, 1, 0, -1, 0],
    [0, 0, -1, -1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, -1, 1, -1, 0, 0, 0, 0, 0, 0, 1, -1, 0, 0, -1, -1, -1, -1, 0],
    [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, -1, 0, -1, -1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -1, 0, -1, 1, 1, 0, -1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, -1, 0, -1, 0, 1, -1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]
]

const createTwoWayRadioBox = component => (
    ({stateKey, text}) => h('label',
        {
            style: {
                display: 'flex',
                alignItems: 'center'
            }
        },

        h('input', {
            style: {marginRight: '.5em'},
            type: 'radio',
            checked: component.state[stateKey],

            onClick: () => component.setState(s => {
                let state = {}

                for (let key in s) {
                    if (s[key] === true) {
                        state[key] = false
                    }
                }

                state[stateKey] = true
                return state
            })
        }),

        h('span', {style: {userSelect: 'none'}}, text)
    )
)

const maxMapValue = map => {
    return Math.max(...map.map(row => Math.max(...row)))
}

const diffMaps = (map1, map2) => {
    return map1.map((row, j) => row.map((x, i) => x - map2[j][i]))
}

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            noMap: true,
            showInfluenceMap: false,
            showDiscreteInfluenceMap: false,
            showAreaMap: false,
            showBlackNearestNeighborMap: false,
            showWhiteNearestNeighborMap: false,
            showCombinedNearestNeighborMap: false,
            showBlackRadianceMap: false,
            showWhiteRadianceMap: false,
            showCombinedRadianceMap: false,
            deadStones: []
        }

        this.RadioBox = createTwoWayRadioBox(this)
    }

    render() {
        let {showInfluenceMap, showDiscreteInfluenceMap, showAreaMap,
            showBlackNearestNeighborMap, showWhiteNearestNeighborMap, showCombinedNearestNeighborMap,
            showBlackRadianceMap, showWhiteRadianceMap, showCombinedRadianceMap} = this.state

        let signMap = JSON.parse(JSON.stringify(originalSignMap))

        for (let [x, y] of this.state.deadStones) {
            signMap[y][x] = 0
        }

        let sign = showBlackNearestNeighborMap || showBlackRadianceMap ? 1 : -1
        let index = sign > 0 ? 1 : 0

        let influenceMap = showInfluenceMap || showDiscreteInfluenceMap
            ? influence.map(signMap, {discrete: showDiscreteInfluenceMap})
            : null

        let nearestNeighborMaps = showBlackNearestNeighborMap
            || showWhiteNearestNeighborMap
            || showCombinedNearestNeighborMap
                ? [-1, 1].map(s => influence.nearestNeighborMap(signMap, s))
                : null
        let combinedNearestNeighborMap = showCombinedNearestNeighborMap
            ? diffMaps(nearestNeighborMaps[0], nearestNeighborMaps[1])
            : null
        let maxCombinedDistance = combinedNearestNeighborMap != null
            ? maxMapValue(combinedNearestNeighborMap)
            : null

        let radianceMaps = showBlackRadianceMap
            || showWhiteRadianceMap
            || showCombinedRadianceMap
                ? [-1, 1].map(s => influence.radianceMap(signMap, s))
                : null
        let maxRadiance = radianceMaps != null
            ? maxMapValue(radianceMaps[index])
            : null
        let combinedRadianceMap = showCombinedRadianceMap
            ? diffMaps(radianceMaps[1], radianceMaps[0])
            : null
        let maxCombinedRadiance = combinedRadianceMap != null
            ? maxMapValue(combinedRadianceMap.map(row => row.map(Math.abs)))
            : null

        return h('section',
            {
                style: {
                    display: 'grid',
                    gridTemplateColumns: '19em auto',
                    gridColumnGap: '1em'
                }
            },

            h('form',
                {
                    style: {
                        display: 'flex',
                        flexDirection: 'column'
                    }
                },

                h('p', {}, 'Click stones to mark them as dead.'),

                h(this.RadioBox, {stateKey: 'noMap', text: 'No map'}),
                h(this.RadioBox, {stateKey: 'showInfluenceMap', text: 'Show influence map'}),
                h(this.RadioBox, {stateKey: 'showDiscreteInfluenceMap', text: 'Show discrete influence map'}),
                h(this.RadioBox, {stateKey: 'showAreaMap', text: 'Show area map'}),
                h(this.RadioBox, {
                    stateKey: 'showBlackNearestNeighborMap',
                    text: 'Show nearest neighbor map for black'
                }),
                h(this.RadioBox, {
                    stateKey: 'showWhiteNearestNeighborMap',
                    text: 'Show nearest neighbor map for white'
                }),
                h(this.RadioBox, {
                    stateKey: 'showCombinedNearestNeighborMap',
                    text: 'Show combined nearest neighbor map'
                }),
                h(this.RadioBox, {stateKey: 'showBlackRadianceMap', text: 'Show radiance map for black'}),
                h(this.RadioBox, {stateKey: 'showWhiteRadianceMap', text: 'Show radiance map for white'}),
                h(this.RadioBox, {stateKey: 'showCombinedRadianceMap', text: 'Show combined radiance map'})
            ),

            h('div', {},
                h(Goban, {
                    signMap: originalSignMap,
                    dimmedVertices: this.state.deadStones,
                    paintMap: influenceMap != null
                        ? influenceMap.map(row => row.map(x => (Math.abs(x) * 2 + 1) / 4 * Math.sign(x)))
                        : showAreaMap
                        ? influence.areaMap(signMap)
                        : combinedNearestNeighborMap != null
                        ? combinedNearestNeighborMap.map(row => row.map(x => x / maxCombinedDistance))
                        : nearestNeighborMaps != null
                        ? nearestNeighborMaps[index].map(row => row.map(x => sign * Math.exp(-x / 2)))
                        : combinedRadianceMap != null
                        ? combinedRadianceMap.map(row => row.map(x => x / maxCombinedRadiance))
                        : radianceMaps != null
                        ? radianceMaps[index].map(row => row.map(x => sign * x / maxRadiance))
                        : null,
                    markerMap: combinedNearestNeighborMap != null
                        ? combinedNearestNeighborMap.map(row => row.map(x => ({
                            type: 'label',
                            label: x.toString()
                        })))
                        : nearestNeighborMaps != null
                        ? nearestNeighborMaps[index].map(row => row.map(x => ({
                            type: 'label',
                            label: x.toString()
                        })))
                        : combinedRadianceMap != null
                        ? combinedRadianceMap.map(row => row.map(x => ({
                            type: 'label',
                            label: x.toString().slice(0, 4)
                        })))
                        : radianceMaps != null
                        ? radianceMaps[index].map(row => row.map(x => ({
                            type: 'label',
                            label: x.toString().slice(0, 4)
                        })))
                        : null,

                    onVertexClick: (evt, vertex) => {
                        this.setState(s => ({
                            deadStones: s.deadStones.some(([x, y]) => vertex[0] === x && vertex[1] === y)
                                ? s.deadStones.filter(([x, y]) => vertex[0] !== x || vertex[1] !== y)
                                : [...s.deadStones, vertex]
                        }))
                    }
                })
            )
        )
    }
}

render(h(App), document.getElementById('root'))
