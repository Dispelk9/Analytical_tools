import { borderRadiusSmall } from '../../js/border/borderRadiusSmall.mjs';
import { themeLightBackgroundSurface } from '../../js/theme/themeLightBackgroundSurface.mjs';
import { themeDarkBackgroundSurface } from '../../js/theme/themeDarkBackgroundSurface.mjs';
import '../../js/grid/gridStyle.mjs';
import '../../js/grid/gridExtendedOffsetS.mjs';
import '../../js/grid/gridExtendedOffsetXXL.mjs';
import '../../js/grid/gridBasicOffsetS.mjs';
import '../../js/grid/gridBasicOffsetXXL.mjs';
import '../../js/grid/gridNarrowOffsetS.mjs';
import '../../js/grid/gridNarrowOffsetXXL.mjs';
import { motionDurationLong } from '../../js/motion/motionDurationLong.mjs';
import { motionEasingBase } from '../../js/motion/motionEasingBase.mjs';
import '../../js/typography/text/textXXSmallStyle.mjs';
import '../../js/typography/text/textXSmallStyle.mjs';
import '../../js/typography/text/textSmallStyle.mjs';
import '../../js/typography/text/textMediumStyle.mjs';
import '../../js/typography/text/textLargeStyle.mjs';
import '../../js/typography/text/textXLargeStyle.mjs';

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
    const backgroundColor = isThemeDark ? themeDarkBackgroundSurface : themeLightBackgroundSurface;
    const highlightColor = isThemeDark ? '#1a1b1e' : '#f7f7f7';
    return {
        display: 'block',
        background: `${backgroundColor} linear-gradient(to right, transparent 0%, ${highlightColor} 25%, transparent 50%) 0 0 / 200% 100%`,
        borderRadius: borderRadiusSmall,
        animation: `${animationName} ${motionDurationLong} ${motionEasingBase} infinite`,
    };
};

export { getSkeletonStyle, skeletonKeyframes };
