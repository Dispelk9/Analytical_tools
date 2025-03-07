'use strict';

var spacingStatic = require('./spacingStatic.cjs');
var spacingFluid = require('./spacingFluid.cjs');

const spacing = {
    static: spacingStatic.spacingStatic,
    fluid: spacingFluid.spacingFluid,
};

exports.spacing = spacing;
