'use strict';

var textShared = require('./textShared.cjs');
var fontHyphenationStyle = require('../../font/fontHyphenationStyle.cjs');
var fontSizeTextXXSmall = require('../../font/fontSizeTextXXSmall.cjs');

const textXXSmallStyle = {
    font: `${textShared._textFontPartA}${fontSizeTextXXSmall.fontSizeTextXXSmall}${textShared._textFontPartB}`,
    ...fontHyphenationStyle.fontHyphenationStyle,
};

exports.textXXSmallStyle = textXXSmallStyle;
