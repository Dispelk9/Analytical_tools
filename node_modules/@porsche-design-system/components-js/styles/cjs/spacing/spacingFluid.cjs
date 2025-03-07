'use strict';

var spacingFluidXSmall = require('./spacingFluidXSmall.cjs');
var spacingFluidSmall = require('./spacingFluidSmall.cjs');
var spacingFluidMedium = require('./spacingFluidMedium.cjs');
var spacingFluidLarge = require('./spacingFluidLarge.cjs');
var spacingFluidXLarge = require('./spacingFluidXLarge.cjs');
var spacingFluidXXLarge = require('./spacingFluidXXLarge.cjs');

const spacingFluid = {
    xSmall: spacingFluidXSmall.spacingFluidXSmall,
    small: spacingFluidSmall.spacingFluidSmall,
    medium: spacingFluidMedium.spacingFluidMedium,
    large: spacingFluidLarge.spacingFluidLarge,
    xLarge: spacingFluidXLarge.spacingFluidXLarge,
    xxLarge: spacingFluidXXLarge.spacingFluidXXLarge,
};

exports.spacingFluid = spacingFluid;
