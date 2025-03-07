'use strict';

var themeLight = require('./themeLight.cjs');
var themeDark = require('./themeDark.cjs');

const theme = {
    light: themeLight.themeLight,
    dark: themeDark.themeDark,
};

exports.theme = theme;
