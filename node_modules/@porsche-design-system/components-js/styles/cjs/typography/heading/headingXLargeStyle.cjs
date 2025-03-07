'use strict';

var headingShared = require('./headingShared.cjs');
var fontSizeHeadingXLarge = require('../../font/fontSizeHeadingXLarge.cjs');

const headingXLargeStyle = {
    font: `${headingShared._headingFontPartA}${fontSizeHeadingXLarge.fontSizeHeadingXLarge}${headingShared._headingFontPartB}`,
};

exports.headingXLargeStyle = headingXLargeStyle;
