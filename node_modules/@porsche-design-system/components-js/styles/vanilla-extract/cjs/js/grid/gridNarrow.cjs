'use strict';

var gridNarrowColumnEnd = require('./gridNarrowColumnEnd.cjs');
var gridNarrowColumnStart = require('./gridNarrowColumnStart.cjs');
var gridNarrowSpanOneHalf = require('./gridNarrowSpanOneHalf.cjs');

const gridNarrow = {
    columnStart: gridNarrowColumnStart.gridNarrowColumnStart,
    columnEnd: gridNarrowColumnEnd.gridNarrowColumnEnd,
    spanOneHalf: gridNarrowSpanOneHalf.gridNarrowSpanOneHalf,
};

exports.gridNarrow = gridNarrow;
