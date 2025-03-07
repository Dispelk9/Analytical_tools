'use strict';

var gridBasicColumnStart = require('./gridBasicColumnStart.cjs');
var gridBasicColumnEnd = require('./gridBasicColumnEnd.cjs');
var gridBasicSpanOneHalf = require('./gridBasicSpanOneHalf.cjs');
var gridBasicSpanOneThird = require('./gridBasicSpanOneThird.cjs');
var gridBasicSpanTwoThirds = require('./gridBasicSpanTwoThirds.cjs');

const gridBasic = {
    columnStart: gridBasicColumnStart.gridBasicColumnStart,
    columnEnd: gridBasicColumnEnd.gridBasicColumnEnd,
    spanOneHalf: gridBasicSpanOneHalf.gridBasicSpanOneHalf,
    spanOneThird: gridBasicSpanOneThird.gridBasicSpanOneThird,
    spanTwoThirds: gridBasicSpanTwoThirds.gridBasicSpanTwoThirds,
};

exports.gridBasic = gridBasic;
