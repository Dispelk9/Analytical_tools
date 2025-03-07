'use strict';

var breakpoint = require('./breakpoint.cjs');

function getMediaQueryMinMax(min, max) {
    return `@media(min-width:${breakpoint.breakpoint[min]}px) and (max-width:${breakpoint.breakpoint[max] - 1}px)`;
}

exports.getMediaQueryMinMax = getMediaQueryMinMax;
