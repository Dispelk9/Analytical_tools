'use strict';

var breakpoint = require('./breakpoint.cjs');

function getMediaQueryMax(max) {
    return `@media(max-width:${breakpoint.breakpoint[max] - 1}px)`;
}

exports.getMediaQueryMax = getMediaQueryMax;
