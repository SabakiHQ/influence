# influence [![Build Status](https://travis-ci.org/SabakiHQ/influence.svg?branch=master)](https://travis-ci.org/SabakiHQ/influence)

Simple heuristics for estimating influence maps on Go positions. This is a work in progress.

## Installation

Use npm to install:

~~~
$ npm install @sabaki/influence
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
    * `maxDistance` `<Number>`
    * `minRadiance` `<Number>`

Returns an array of arrays of the same size as `data`. Each entry is a number, the bigger it is the greater the influence of a color. A negative number corresponds to white influence whereas a positive number denotes black influence.

This map does not take dead stones into account, i.e. it will assume all stones specified in `data` are alive. To get better results, remove dead stones first, either manually or with the [`deadstones` module](https://github.com/SabakiHQ/deadstones).

If `discrete` is set to `true`, the map will only contain `-1`, `0`, or `1` as values.
