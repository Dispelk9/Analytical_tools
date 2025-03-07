'use strict';

var gridSharedOffset = require('./gridSharedOffset.cjs');
var gridShared = require('./gridShared.cjs');

const gridWideOffsetXXL = `calc(${gridSharedOffset._gridPadding} + ${gridShared._gridSafeZoneXXL})`;

exports.gridWideOffsetXXL = gridWideOffsetXXL;
