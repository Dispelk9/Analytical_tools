'use strict';

var themeLightStateFocus = require('./themeLightStateFocus.cjs');

const themeDarkStateFocus = themeLightStateFocus.themeLightStateFocus; // it's important that focus color is the same for light and dark theme

exports.themeDarkStateFocus = themeDarkStateFocus;
