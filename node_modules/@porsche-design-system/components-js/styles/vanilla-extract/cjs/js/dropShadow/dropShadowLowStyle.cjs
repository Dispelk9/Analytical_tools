'use strict';

var dropShadowShared = require('./dropShadowShared.cjs');

const dropShadowLowStyle = {
    boxShadow: `0px 3px 8px ${dropShadowShared._dropShadowBackgroundColor}`, // filter: drop-shadow() causes visual glitches in Firefox in combination with frostedGlassStyle
};

exports.dropShadowLowStyle = dropShadowLowStyle;
