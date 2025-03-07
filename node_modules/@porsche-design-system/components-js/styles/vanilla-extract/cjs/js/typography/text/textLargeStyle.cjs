'use strict';

var textShared = require('./textShared.cjs');
var fontHyphenationStyle = require('../../font/fontHyphenationStyle.cjs');
var fontSizeTextLarge = require('../../font/fontSizeTextLarge.cjs');

const textLargeStyle = {
    font: `${textShared._textFontPartA}${fontSizeTextLarge.fontSizeTextLarge}${textShared._textFontPartB}`,
    ...fontHyphenationStyle.fontHyphenationStyle,
};

exports.textLargeStyle = textLargeStyle;
