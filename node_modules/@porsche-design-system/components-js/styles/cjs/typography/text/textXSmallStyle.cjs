'use strict';

var textShared = require('./textShared.cjs');
var fontHyphenationStyle = require('../../font/fontHyphenationStyle.cjs');
var fontSizeTextXSmall = require('../../font/fontSizeTextXSmall.cjs');

const textXSmallStyle = {
    font: `${textShared._textFontPartA}${fontSizeTextXSmall.fontSizeTextXSmall}${textShared._textFontPartB}`,
    ...fontHyphenationStyle.fontHyphenationStyle,
};

exports.textXSmallStyle = textXSmallStyle;
