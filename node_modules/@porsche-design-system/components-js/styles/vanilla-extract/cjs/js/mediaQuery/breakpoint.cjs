'use strict';

var breakpointBase = require('./breakpointBase.cjs');
var breakpointXS = require('./breakpointXS.cjs');
var breakpointS = require('./breakpointS.cjs');
var breakpointM = require('./breakpointM.cjs');
var breakpointL = require('./breakpointL.cjs');
var breakpointXL = require('./breakpointXL.cjs');
var breakpointXXL = require('./breakpointXXL.cjs');

const breakpoint = {
    base: breakpointBase.breakpointBase,
    xs: breakpointXS.breakpointXS,
    s: breakpointS.breakpointS,
    m: breakpointM.breakpointM,
    l: breakpointL.breakpointL,
    xl: breakpointXL.breakpointXL,
    xxl: breakpointXXL.breakpointXXL,
};

exports.breakpoint = breakpoint;
