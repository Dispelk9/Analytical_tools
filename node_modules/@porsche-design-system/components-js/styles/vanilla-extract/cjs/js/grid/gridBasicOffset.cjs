'use strict';

var gridBasicOffsetBase = require('./gridBasicOffsetBase.cjs');
var gridBasicOffsetS = require('./gridBasicOffsetS.cjs');
var gridBasicOffsetXXL = require('./gridBasicOffsetXXL.cjs');

const gridBasicOffset = {
    base: gridBasicOffsetBase.gridBasicOffsetBase,
    s: gridBasicOffsetS.gridBasicOffsetS,
    xxl: gridBasicOffsetXXL.gridBasicOffsetXXL,
};

exports.gridBasicOffset = gridBasicOffset;
