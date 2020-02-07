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
            showBlackRadianceMap: false,
            showWhiteRadianceMap: false,
            deadStones: []
        }

        this.RadioBox = createTwoWayRadioBox(this)
    }

    render() {
        let {showInfluenceMap, showDiscreteInfluenceMap, showAreaMap,
            showBlackNearestNeighborMap, showWhiteNearestNeighborMap,
            showBlackRadianceMap, showWhiteRadianceMap} = this.state

        let signMap = JSON.parse(JSON.stringify(originalSignMap))

        for (let [x, y] of this.state.deadStones) {
            signMap[y][x] = 0
        }

        let sign = showBlackNearestNeighborMap || showBlackRadianceMap ? 1 : -1
        let influenceMap = showInfluenceMap || showDiscreteInfluenceMap
            ? influence.map(signMap, {discrete: showDiscreteInfluenceMap})
            : null
        let nearestNeighborMap = showBlackNearestNeighborMap || showWhiteNearestNeighborMap
            ? influence.nearestNeighborMap(signMap, sign)
            : null
        let radianceMap = showBlackRadianceMap || showWhiteRadianceMap
            ? influence.radianceMap(signMap, sign)
            : null
        let maxRadiance = radianceMap != null
            ? Math.max(...radianceMap.map(row => Math.max(...row)))
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
                h(this.RadioBox, {stateKey: 'showBlackRadianceMap', text: 'Show radiance map for black'}),
                h(this.RadioBox, {stateKey: 'showWhiteRadianceMap', text: 'Show radiance map for white'})
            ),

            h('div', {},
                h(Goban, {
                    signMap: originalSignMap,
                    dimmedVertices: this.state.deadStones,
                    paintMap: influenceMap != null
                        ? influenceMap.map(row => row.map(x => (Math.abs(x) * 2 + 1) / 4 * Math.sign(x)))
                        : showAreaMap
                        ? influence.areaMap(signMap)
                        : nearestNeighborMap != null
                        ? nearestNeighborMap.map(row => row.map(x => sign * Math.exp(-x / 2)))
                        : radianceMap != null
                        ? radianceMap.map(row => row.map(x => sign * x / maxRadiance))
                        : null,
                    markerMap: nearestNeighborMap != null
                        ? nearestNeighborMap.map(row => row.map(x => ({
                            type: 'label',
                            label: x.toString()
                        })))
                        : radianceMap != null
                        ? radianceMap.map(row => row.map(x => ({
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
