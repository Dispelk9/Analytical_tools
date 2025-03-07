'use strict';

var displayShared = require('./displayShared.cjs');
var fontSizeDisplayMedium = require('../../font/fontSizeDisplayMedium.cjs');

const displayMediumStyle = {
    font: `${displayShared._displayFontPartA}${fontSizeDisplayMedium.fontSizeDisplayMedium}${displayShared._displayFontPartB}`,
};

exports.displayMediumStyle = displayMediumStyle;
