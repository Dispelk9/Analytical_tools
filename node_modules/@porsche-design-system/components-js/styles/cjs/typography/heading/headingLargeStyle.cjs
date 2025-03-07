'use strict';

var headingShared = require('./headingShared.cjs');
var fontSizeHeadingLarge = require('../../font/fontSizeHeadingLarge.cjs');

const headingLargeStyle = {
    font: `${headingShared._headingFontPartA}${fontSizeHeadingLarge.fontSizeHeadingLarge}${headingShared._headingFontPartB}`,
};

exports.headingLargeStyle = headingLargeStyle;
