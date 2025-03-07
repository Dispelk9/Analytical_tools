'use strict';

var spacingStaticXSmall = require('./spacingStaticXSmall.cjs');
var spacingStaticSmall = require('./spacingStaticSmall.cjs');
var spacingStaticMedium = require('./spacingStaticMedium.cjs');
var spacingStaticLarge = require('./spacingStaticLarge.cjs');
var spacingStaticXLarge = require('./spacingStaticXLarge.cjs');
var spacingStaticXXLarge = require('./spacingStaticXXLarge.cjs');

const spacingStatic = {
    xSmall: spacingStaticXSmall.spacingStaticXSmall,
    small: spacingStaticSmall.spacingStaticSmall,
    medium: spacingStaticMedium.spacingStaticMedium,
    large: spacingStaticLarge.spacingStaticLarge,
    xLarge: spacingStaticXLarge.spacingStaticXLarge,
    xxLarge: spacingStaticXXLarge.spacingStaticXXLarge,
};

exports.spacingStatic = spacingStatic;
