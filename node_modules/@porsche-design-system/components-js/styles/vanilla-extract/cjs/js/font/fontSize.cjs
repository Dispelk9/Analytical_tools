'use strict';

var fontSizeText = require('./fontSizeText.cjs');
var fontSizeHeading = require('./fontSizeHeading.cjs');
var fontSizeDisplay = require('./fontSizeDisplay.cjs');

// Fluid Type Scale Calculator (https://fluid-type-scale.com) was used to generate a type scale set based on the "golden ratio".
// "Text/Heading": min - base: 16px, screen: 320px, ratio: 1,2 / max - base: 16px, screen: 1760px, ratio: 1,309
// "Display": min - base: 16px, screen: 320px, ratio: 1,2 / max - base: 16px, screen: 1760px, ratio: 1,5
const fontSize = {
    text: fontSizeText.fontSizeText,
    heading: fontSizeHeading.fontSizeHeading,
    display: fontSizeDisplay.fontSizeDisplay,
};

exports.fontSize = fontSize;
