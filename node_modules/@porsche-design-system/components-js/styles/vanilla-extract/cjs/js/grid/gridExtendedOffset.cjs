'use strict';

var gridExtendedOffsetBase = require('./gridExtendedOffsetBase.cjs');
var gridExtendedOffsetS = require('./gridExtendedOffsetS.cjs');
var gridExtendedOffsetXXL = require('./gridExtendedOffsetXXL.cjs');

const gridExtendedOffset = {
    base: gridExtendedOffsetBase.gridExtendedOffsetBase,
    s: gridExtendedOffsetS.gridExtendedOffsetS,
    xxl: gridExtendedOffsetXXL.gridExtendedOffsetXXL,
};

exports.gridExtendedOffset = gridExtendedOffset;
