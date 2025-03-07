'use strict';

var borderRadiusSmall = require('../border/borderRadiusSmall.cjs');
var themeLightBackgroundSurface = require('../theme/themeLightBackgroundSurface.cjs');
var themeDarkBackgroundSurface = require('../theme/themeDarkBackgroundSurface.cjs');
var motionDurationLong = require('../motion/motionDurationLong.cjs');
var motionEasingBase = require('../motion/motionEasingBase.cjs');

const getSkeletonStyle = (opts) => {
    const { theme = 'light' } = opts || {};
    const isThemeDark = theme === 'dark';
    const backgroundColor = isThemeDark ? themeDarkBackgroundSurface.themeDarkBackgroundSurface : themeLightBackgroundSurface.themeLightBackgroundSurface;
    const highlightColor = isThemeDark ? '#1a1b1e' : '#f7f7f7';
    return {
        display: 'block',
        background: `${backgroundColor} linear-gradient(to right, transparent 0%, ${highlightColor} 25%, transparent 50%) 0 0 / 200% 100%`,
        borderRadius: borderRadiusSmall.borderRadiusSmall,
        animation: `skeletonAnimation ${motionDurationLong.motionDurationLong} ${motionEasingBase.motionEasingBase} infinite`,
        '@keyframes skeletonAnimation': {
            from: { backgroundPositionX: '100%' },
            to: { backgroundPositionX: '-100%' },
        },
    };
};

exports.getSkeletonStyle = getSkeletonStyle;
