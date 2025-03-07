'use strict';

var gridFullColumnStart = require('./gridFullColumnStart.cjs');
var gridFullColumnEnd = require('./gridFullColumnEnd.cjs');

const gridFull = {
    columnStart: gridFullColumnStart.gridFullColumnStart,
    columnEnd: gridFullColumnEnd.gridFullColumnEnd,
};

exports.gridFull = gridFull;
