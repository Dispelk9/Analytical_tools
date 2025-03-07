'use strict';

var borderRadiusSmall = require('../../js/border/borderRadiusSmall.cjs');
var themeLightBackgroundSurface = require('../../js/theme/themeLightBackgroundSurface.cjs');
var themeDarkBackgroundSurface = require('../../js/theme/themeDarkBackgroundSurface.cjs');
require('../../js/grid/gridStyle.cjs');
require('../../js/grid/gridExtendedOffsetS.cjs');
require('../../js/grid/gridExtendedOffsetXXL.cjs');
require('../../js/grid/gridBasicOffsetS.cjs');
require('../../js/grid/gridBasicOffsetXXL.cjs');
require('../../js/grid/gridNarrowOffsetS.cjs');
require('../../js/grid/gridNarrowOffsetXXL.cjs');
var motionDurationLong = require('../../js/motion/motionDurationLong.cjs');
var motionEasingBase = require('../../js/motion/motionEasingBase.cjs');
require('../../js/typography/text/textXXSmallStyle.cjs');
require('../../js/typography/text/textXSmallStyle.cjs');
require('../../js/typography/text/textSmallStyle.cjs');
require('../../js/typography/text/textMediumStyle.cjs');
require('../../js/typography/text/textLargeStyle.cjs');
require('../../js/typography/text/textXLargeStyle.cjs');

const skeletonKeyframes = {
    from: { backgroundPositionX: '100%' },
    to: { backgroundPositionX: '-100%' },
};
/**
 * Generates skeleton loading styles with a background animation.
 *
 * @param {string} animationName - The name of the animation, which must be the generated name from `vanilla-extract`.
 * This should be the return value of the `keyframes` function.
 * @param {Options} [opts] - Optional configuration.
 * @param {Exclude<Theme, 'auto'>} [opts.theme='light'] - The theme to use, either 'light' or 'dark'.
 */
const getSkeletonStyle = (animationName, opts) => {
    const { theme = 'light' } = opts || {};
    const isThemeDark = theme === 'dark';
    const backgroundColor = isThemeDark ? themeDarkBackgroundSurface.themeDarkBackgroundSurface : themeLightBackgroundSurface.themeLightBackgroundSurface;
    const highlightColor = isThemeDark ? '#1a1b1e' : '#f7f7f7';
    return {
        display: 'block',
        background: `${backgroundColor} linear-gradient(to right, transparent 0%, ${highlightColor} 25%, transparent 50%) 0 0 / 200% 100%`,
        borderRadius: borderRadiusSmall.borderRadiusSmall,
        animation: `${animationName} ${motionDurationLong.motionDurationLong} ${motionEasingBase.motionEasingBase} infinite`,
    };
};

exports.getSkeletonStyle = getSkeletonStyle;
exports.skeletonKeyframes = skeletonKeyframes;
