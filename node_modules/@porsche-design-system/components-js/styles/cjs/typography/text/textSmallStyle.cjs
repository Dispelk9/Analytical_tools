'use strict';

var textShared = require('./textShared.cjs');
var fontHyphenationStyle = require('../../font/fontHyphenationStyle.cjs');
var fontSizeTextSmall = require('../../font/fontSizeTextSmall.cjs');

const textSmallStyle = {
    font: `${textShared._textFontPartA}${fontSizeTextSmall.fontSizeTextSmall}${textShared._textFontPartB}`,
    ...fontHyphenationStyle.fontHyphenationStyle,
};

exports.textSmallStyle = textSmallStyle;
