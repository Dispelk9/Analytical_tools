'use strict';

var fontWeightRegular = require('./fontWeightRegular.cjs');
var fontWeightSemiBold = require('./fontWeightSemiBold.cjs');
var fontWeightBold = require('./fontWeightBold.cjs');

const fontWeight = {
    regular: fontWeightRegular.fontWeightRegular,
    semiBold: fontWeightSemiBold.fontWeightSemiBold,
    bold: fontWeightBold.fontWeightBold,
};

exports.fontWeight = fontWeight;
