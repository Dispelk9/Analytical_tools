'use strict';

var borderRadiusSmall = require('./borderRadiusSmall.cjs');
var borderRadiusMedium = require('./borderRadiusMedium.cjs');
var borderRadiusLarge = require('./borderRadiusLarge.cjs');

const borderRadius = {
    small: borderRadiusSmall.borderRadiusSmall,
    medium: borderRadiusMedium.borderRadiusMedium,
    large: borderRadiusLarge.borderRadiusLarge,
};

exports.borderRadius = borderRadius;
