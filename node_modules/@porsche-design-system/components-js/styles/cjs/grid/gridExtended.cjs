'use strict';

var gridExtendedColumnStart = require('./gridExtendedColumnStart.cjs');
var gridExtendedColumnEnd = require('./gridExtendedColumnEnd.cjs');
var gridExtendedSpanOneHalf = require('./gridExtendedSpanOneHalf.cjs');

const gridExtended = {
    columnStart: gridExtendedColumnStart.gridExtendedColumnStart,
    columnEnd: gridExtendedColumnEnd.gridExtendedColumnEnd,
    spanOneHalf: gridExtendedSpanOneHalf.gridExtendedSpanOneHalf,
};

exports.gridExtended = gridExtended;
