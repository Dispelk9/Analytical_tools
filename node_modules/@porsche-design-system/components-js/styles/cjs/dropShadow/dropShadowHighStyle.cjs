'use strict';

var dropShadowShared = require('./dropShadowShared.cjs');

const dropShadowHighStyle = {
    boxShadow: `0px 8px 40px ${dropShadowShared._dropShadowBackgroundColor}`, // filter: drop-shadow() causes visual glitches in Firefox in combination with frostedGlassStyle
};

exports.dropShadowHighStyle = dropShadowHighStyle;
