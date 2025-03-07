'use strict';

var gridWideColumnStart = require('./gridWideColumnStart.cjs');
var gridWideColumnEnd = require('./gridWideColumnEnd.cjs');

const gridWide = {
    columnStart: gridWideColumnStart.gridWideColumnStart,
    columnEnd: gridWideColumnEnd.gridWideColumnEnd,
};

exports.gridWide = gridWide;
