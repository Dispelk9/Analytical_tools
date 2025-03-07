'use strict';

var fontFamily = require('../../font/fontFamily.cjs');
var fontLineHeight = require('../../font/fontLineHeight.cjs');
var fontWeightSemiBold = require('../../font/fontWeightSemiBold.cjs');
var fontStyleNormal = require('../../font/fontStyleNormal.cjs');
var fontVariant = require('../../font/fontVariant.cjs');

const _headingFontPartA = `${fontStyleNormal.fontStyleNormal} ${fontVariant.fontVariant} ${fontWeightSemiBold.fontWeightSemiBold} `;
const _headingFontPartB = `/${fontLineHeight.fontLineHeight} ${fontFamily.fontFamily}`;

exports._headingFontPartA = _headingFontPartA;
exports._headingFontPartB = _headingFontPartB;
