'use strict';

var themeLightStateHover = require('./themeLightStateHover.cjs');

const themeDarkStateHover = themeLightStateHover.themeLightStateHover; // it's important that hover color is the same for light and dark theme

exports.themeDarkStateHover = themeDarkStateHover;
