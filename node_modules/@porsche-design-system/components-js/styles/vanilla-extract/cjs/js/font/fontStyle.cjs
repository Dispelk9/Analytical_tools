'use strict';

var fontStyleNormal = require('./fontStyleNormal.cjs');
var fontStyleItalic = require('./fontStyleItalic.cjs');

const fontStyle = {
    normal: fontStyleNormal.fontStyleNormal,
    italic: fontStyleItalic.fontStyleItalic,
};

exports.fontStyle = fontStyle;
