'use strict';

var textShared = require('./textShared.cjs');
var fontHyphenationStyle = require('../../font/fontHyphenationStyle.cjs');
var fontSizeTextMedium = require('../../font/fontSizeTextMedium.cjs');

const textMediumStyle = {
    font: `${textShared._textFontPartA}${fontSizeTextMedium.fontSizeTextMedium}${textShared._textFontPartB}`,
    ...fontHyphenationStyle.fontHyphenationStyle,
};

exports.textMediumStyle = textMediumStyle;
