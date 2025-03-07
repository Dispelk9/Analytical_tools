'use strict';

var gridSharedOffset = require('./gridSharedOffset.cjs');

const gridNarrowOffsetS = gridSharedOffset._getGridOffsetS('narrow');

exports.gridNarrowOffsetS = gridNarrowOffsetS;
