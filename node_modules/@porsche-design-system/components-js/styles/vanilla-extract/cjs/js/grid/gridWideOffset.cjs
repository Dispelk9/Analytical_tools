'use strict';

var gridWideOffsetBase = require('./gridWideOffsetBase.cjs');
var gridWideOffsetS = require('./gridWideOffsetS.cjs');
var gridWideOffsetXXL = require('./gridWideOffsetXXL.cjs');

const gridWideOffset = {
    base: gridWideOffsetBase.gridWideOffsetBase,
    s: gridWideOffsetS.gridWideOffsetS,
    xxl: gridWideOffsetXXL.gridWideOffsetXXL,
};

exports.gridWideOffset = gridWideOffset;
