'use strict';

var fontSizeHeadingSmall = require('./fontSizeHeadingSmall.cjs');
var fontSizeHeadingMedium = require('./fontSizeHeadingMedium.cjs');
var fontSizeHeadingLarge = require('./fontSizeHeadingLarge.cjs');
var fontSizeHeadingXLarge = require('./fontSizeHeadingXLarge.cjs');
var fontSizeHeadingXXLarge = require('./fontSizeHeadingXXLarge.cjs');

const fontSizeHeading = {
    small: fontSizeHeadingSmall.fontSizeHeadingSmall,
    medium: fontSizeHeadingMedium.fontSizeHeadingMedium,
    large: fontSizeHeadingLarge.fontSizeHeadingLarge,
    xLarge: fontSizeHeadingXLarge.fontSizeHeadingXLarge,
    xxLarge: fontSizeHeadingXXLarge.fontSizeHeadingXXLarge,
};

exports.fontSizeHeading = fontSizeHeading;
