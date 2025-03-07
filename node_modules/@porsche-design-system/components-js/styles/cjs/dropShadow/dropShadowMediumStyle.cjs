'use strict';

var dropShadowShared = require('./dropShadowShared.cjs');

const dropShadowMediumStyle = {
    boxShadow: `0px 4px 16px ${dropShadowShared._dropShadowBackgroundColor}`, // filter: drop-shadow() causes visual glitches in Firefox in combination with frostedGlassStyle
};

exports.dropShadowMediumStyle = dropShadowMediumStyle;
