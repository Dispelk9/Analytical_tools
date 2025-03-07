'use strict';

var headingShared = require('./headingShared.cjs');
var fontSizeHeadingMedium = require('../../font/fontSizeHeadingMedium.cjs');

const headingMediumStyle = {
    font: `${headingShared._headingFontPartA}${fontSizeHeadingMedium.fontSizeHeadingMedium}${headingShared._headingFontPartB}`,
};

exports.headingMediumStyle = headingMediumStyle;
