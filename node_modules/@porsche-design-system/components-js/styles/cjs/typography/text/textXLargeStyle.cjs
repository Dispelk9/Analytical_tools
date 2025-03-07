'use strict';

var textShared = require('./textShared.cjs');
var fontHyphenationStyle = require('../../font/fontHyphenationStyle.cjs');
var fontSizeTextXLarge = require('../../font/fontSizeTextXLarge.cjs');

const textXLargeStyle = {
    font: `${textShared._textFontPartA}${fontSizeTextXLarge.fontSizeTextXLarge}${textShared._textFontPartB}`,
    ...fontHyphenationStyle.fontHyphenationStyle,
};

exports.textXLargeStyle = textXLargeStyle;
