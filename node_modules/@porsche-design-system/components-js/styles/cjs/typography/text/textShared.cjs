'use strict';

var fontFamily = require('../../font/fontFamily.cjs');
var fontLineHeight = require('../../font/fontLineHeight.cjs');
var fontWeightRegular = require('../../font/fontWeightRegular.cjs');
var fontStyleNormal = require('../../font/fontStyleNormal.cjs');
var fontVariant = require('../../font/fontVariant.cjs');

const _textFontPartA = `${fontStyleNormal.fontStyleNormal} ${fontVariant.fontVariant} ${fontWeightRegular.fontWeightRegular} `;
const _textFontPartB = `/${fontLineHeight.fontLineHeight} ${fontFamily.fontFamily}`;

exports._textFontPartA = _textFontPartA;
exports._textFontPartB = _textFontPartB;
