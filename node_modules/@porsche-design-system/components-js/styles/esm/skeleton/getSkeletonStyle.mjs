import { borderRadiusSmall } from '../border/borderRadiusSmall.mjs';
import { themeLightBackgroundSurface } from '../theme/themeLightBackgroundSurface.mjs';
import { themeDarkBackgroundSurface } from '../theme/themeDarkBackgroundSurface.mjs';
import { motionDurationLong } from '../motion/motionDurationLong.mjs';
import { motionEasingBase } from '../motion/motionEasingBase.mjs';

const getSkeletonStyle = (opts) => {
    const { theme = 'light' } = opts || {};
    const isThemeDark = theme === 'dark';
    const backgroundColor = isThemeDark ? themeDarkBackgroundSurface : themeLightBackgroundSurface;
    const highlightColor = isThemeDark ? '#1a1b1e' : '#f7f7f7';
    return {
        display: 'block',
        background: `${backgroundColor} linear-gradient(to right, transparent 0%, ${highlightColor} 25%, transparent 50%) 0 0 / 200% 100%`,
        borderRadius: borderRadiusSmall,
        animation: `skeletonAnimation ${motionDurationLong} ${motionEasingBase} infinite`,
        '@keyframes skeletonAnimation': {
            from: { backgroundPositionX: '100%' },
            to: { backgroundPositionX: '-100%' },
        },
    };
};

export { getSkeletonStyle };
