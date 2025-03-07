'use strict';

var borderRadius = require('./borderRadius.cjs');
var borderWidth = require('./borderWidth.cjs');

const border = {
    radius: borderRadius.borderRadius,
    width: borderWidth.borderWidth,
};

exports.border = border;
