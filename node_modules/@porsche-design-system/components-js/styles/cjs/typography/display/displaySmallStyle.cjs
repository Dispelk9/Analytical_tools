'use strict';

var displayShared = require('./displayShared.cjs');
var fontSizeDisplaySmall = require('../../font/fontSizeDisplaySmall.cjs');

const displaySmallStyle = {
    font: `${displayShared._displayFontPartA}${fontSizeDisplaySmall.fontSizeDisplaySmall}${displayShared._displayFontPartB}`,
};

exports.displaySmallStyle = displaySmallStyle;
