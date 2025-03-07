'use strict';

var headingShared = require('./headingShared.cjs');
var fontSizeHeadingSmall = require('../../font/fontSizeHeadingSmall.cjs');

const headingSmallStyle = {
    font: `${headingShared._headingFontPartA}${fontSizeHeadingSmall.fontSizeHeadingSmall}${headingShared._headingFontPartB}`,
};

exports.headingSmallStyle = headingSmallStyle;
