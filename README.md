# @sabaki/influence [![Build Status](https://travis-ci.org/SabakiHQ/influence.svg?branch=master)](https://travis-ci.org/SabakiHQ/influence)

Simple static heuristics for estimating influence maps on Go positions.

## Installation

Use npm to install:

~~~
$ npm install @sabaki/influence
~~~

Then require it as follows:

~~~js
const influence = require('@sabaki/influence');
~~~

## API

### Board Data

The board arrangement is represented by an array of arrays. Each of those subarrays represent one row, all containing the same number of integers. `-1` denotes a white stone, `1` a black stone, and `0` represents an empty vertex

#### Example

~~~js
[[ 0,  0,  1,  0, -1, -1,  1,  0, 0],
 [ 1,  0,  1, -1, -1,  1,  1,  1, 0],
 [ 0,  0,  1, -1,  0,  1, -1, -1, 0],
 [ 1,  1,  1, -1, -1, -1,  1, -1, 0],
 [ 1, -1,  1,  1, -1,  1,  1,  1, 0],
 [-1, -1, -1, -1, -1,  1,  0,  0, 0],
 [ 0, -1, -1,  0, -1,  1,  1,  1, 1],
 [ 0,  0,  0,  0,  0, -1, -1, -1, 1],
 [ 0,  0,  0,  0,  0,  0,  0, -1, 0]]
~~~

### `influence.map(data[, options])`

* `data` - [Board data](#board-data)
* `options` `<Object>` *(optional)*
    * `discrete` `<Boolean>` *(optional)* - Default: `false`
    * `maxDistance` `<Number>` *(optional)* - Default: `6`

      Only assigns a non-zero number to a vertex if its Manhattan distance to a stone of corresponding color is less or equal to `maxDistance`.

    * `minRadiance` `<Number>` *(optional)* - Default: `2`

      Only assigns a non-zero number to a vertex if the vertex has radiance in its corresponding color greater or equal to `minRadiance`.

Returns an array of arrays of the same size as `data`. Each entry is a number between `-1` and `1` inclusive. A negative number corresponds to white influence whereas a positive number denotes black influence.

This map does not take dead stones into account, i.e. it will assume all stones specified in `data` are alive. To get better results, remove dead stones first, either manually or with the [`deadstones` module](https://github.com/SabakiHQ/deadstones).

If `discrete` is set to `true`, the map will only contain `-1`, `0`, or `1` as values.

### `influence.areaMap(data)`

* `data` - [Board data](#board-data)

Returns an array of arrays of the same size as `data`. Each entry is either `-1`, `0`, or `1`, corresponding to white area, neutral area, and black area.

### `influence.nearestNeighborMap(data, sign)`

* `data` - [Board data](#board-data)
* `sign` `-1` | `1`

Returns an array of arrays of the same size as `data`. Each entry is an non-negative integer which denotes the Manhattan distance to the nearest stone with the color given by `sign`. `-1` denotes white and `1` corresponds to black.

### `influence.radianceMap(data, sign[, options])`

* `data` - [Board data](#board-data)
* `sign` `-1` | `1`
* `options` `<Object>` *(optional)*
    * `p1` `<Number>` *(optional)* - Default: `6`
    * `p2` `<Number>` *(optional)* - Default: `1.5`
    * `p3` `<Number>` *(optional)* - Default: `2`

Returns an array of arrays of the same size as `data`. Each entry is a non-negative number which encodes how many stones of the color corresponding to `sign` is in its vicinity. `-1` corresponds to white stones whereas `1` denotes black stones. Each chain of the color corresponding to `sign` emits *radiance* which diminishes over distance, adds up with the radiance of other chains, and reflects at the board edge.

`p1`, `p2`, and `p3` are parameters, controlling how strong the radiance is initially and how it diminishes.

## Build Demo

Make sure you have Node.js v12 and npm installed. First, clone this repository via Git, then install all dependencies with npm:

~~~
$ git clone https://github.com/SabakiHQ/influence
$ cd influence
$ npm install
~~~

Use the `build-demo` script to build the demo project:

~~~
$ npm run build-demo
~~~

You can use the `watch-demo` command for development:

~~~
$ npm run watch-demo
~~~

Open `demo/index.html` in your browser to run demo.
