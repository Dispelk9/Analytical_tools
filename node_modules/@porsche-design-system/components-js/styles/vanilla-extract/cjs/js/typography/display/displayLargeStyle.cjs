'use strict';

var displayShared = require('./displayShared.cjs');
var fontSizeDisplayLarge = require('../../font/fontSizeDisplayLarge.cjs');

const displayLargeStyle = {
    font: `${displayShared._displayFontPartA}${fontSizeDisplayLarge.fontSizeDisplayLarge}${displayShared._displayFontPartB}`,
};

exports.displayLargeStyle = displayLargeStyle;
