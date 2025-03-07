'use strict';

var fontSizeDisplaySmall = require('./fontSizeDisplaySmall.cjs');
var fontSizeDisplayMedium = require('./fontSizeDisplayMedium.cjs');
var fontSizeDisplayLarge = require('./fontSizeDisplayLarge.cjs');

const fontSizeDisplay = {
    small: fontSizeDisplaySmall.fontSizeDisplaySmall,
    medium: fontSizeDisplayMedium.fontSizeDisplayMedium,
    large: fontSizeDisplayLarge.fontSizeDisplayLarge,
};

exports.fontSizeDisplay = fontSizeDisplay;
