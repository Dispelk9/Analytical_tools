'use strict';

var fontFamily = require('../../font/fontFamily.cjs');
var fontLineHeight = require('../../font/fontLineHeight.cjs');
var fontWeightRegular = require('../../font/fontWeightRegular.cjs');
var fontStyleNormal = require('../../font/fontStyleNormal.cjs');
var fontVariant = require('../../font/fontVariant.cjs');

const _displayFontPartA = `${fontStyleNormal.fontStyleNormal} ${fontVariant.fontVariant} ${fontWeightRegular.fontWeightRegular} `;
const _displayFontPartB = `/${fontLineHeight.fontLineHeight} ${fontFamily.fontFamily}`;

exports._displayFontPartA = _displayFontPartA;
exports._displayFontPartB = _displayFontPartB;
