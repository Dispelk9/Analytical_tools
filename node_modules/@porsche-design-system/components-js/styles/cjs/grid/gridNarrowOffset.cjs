'use strict';

var gridNarrowOffsetBase = require('./gridNarrowOffsetBase.cjs');
var gridNarrowOffsetS = require('./gridNarrowOffsetS.cjs');
var gridNarrowOffsetXXL = require('./gridNarrowOffsetXXL.cjs');

const gridNarrowOffset = {
    base: gridNarrowOffsetBase.gridNarrowOffsetBase,
    s: gridNarrowOffsetS.gridNarrowOffsetS,
    xxl: gridNarrowOffsetXXL.gridNarrowOffsetXXL,
};

exports.gridNarrowOffset = gridNarrowOffset;
