'use strict';

var fontSizeTextXXSmall = require('./fontSizeTextXXSmall.cjs');
var fontSizeTextXSmall = require('./fontSizeTextXSmall.cjs');
var fontSizeTextSmall = require('./fontSizeTextSmall.cjs');
var fontSizeTextMedium = require('./fontSizeTextMedium.cjs');
var fontSizeTextLarge = require('./fontSizeTextLarge.cjs');
var fontSizeTextXLarge = require('./fontSizeTextXLarge.cjs');

const fontSizeText = {
    xxSmall: fontSizeTextXXSmall.fontSizeTextXXSmall,
    xSmall: fontSizeTextXSmall.fontSizeTextXSmall,
    small: fontSizeTextSmall.fontSizeTextSmall,
    medium: fontSizeTextMedium.fontSizeTextMedium,
    large: fontSizeTextLarge.fontSizeTextLarge,
    xLarge: fontSizeTextXLarge.fontSizeTextXLarge,
};

exports.fontSizeText = fontSizeText;
