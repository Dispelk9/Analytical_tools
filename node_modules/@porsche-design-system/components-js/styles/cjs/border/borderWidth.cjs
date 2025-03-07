'use strict';

var borderWidthBase = require('./borderWidthBase.cjs');
var borderWidthThin = require('./borderWidthThin.cjs');

const borderWidth = {
    base: borderWidthBase.borderWidthBase,
    thin: borderWidthThin.borderWidthThin,
};

exports.borderWidth = borderWidth;
