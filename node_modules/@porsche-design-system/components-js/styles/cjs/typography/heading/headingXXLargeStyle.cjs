'use strict';

var headingShared = require('./headingShared.cjs');
var fontSizeHeadingXXLarge = require('../../font/fontSizeHeadingXXLarge.cjs');

const headingXXLargeStyle = {
    font: `${headingShared._headingFontPartA}${fontSizeHeadingXXLarge.fontSizeHeadingXXLarge}${headingShared._headingFontPartB}`,
};

exports.headingXXLargeStyle = headingXXLargeStyle;
