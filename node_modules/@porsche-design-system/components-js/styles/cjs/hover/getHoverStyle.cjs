'use strict';

var borderRadiusSmall = require('../border/borderRadiusSmall.cjs');
var borderRadiusMedium = require('../border/borderRadiusMedium.cjs');
var motionDurationShort = require('../motion/motionDurationShort.cjs');
var motionEasingBase = require('../motion/motionEasingBase.cjs');
var themeLightStateHover = require('../theme/themeLightStateHover.cjs');

const offsetHorizontal = '2px';
const getHoverStyles = (borderRadius = 'small') => {
    const borderRadiusValue = borderRadius === 'small'
        ? borderRadiusSmall.borderRadiusSmall
        : borderRadius === 'medium'
            ? borderRadiusMedium.borderRadiusMedium
            : borderRadius || borderRadiusSmall.borderRadiusSmall;
    return {
        borderRadius: borderRadiusValue, // it's visually being reflected on both (when placed here), element and hover
        marginLeft: `-${offsetHorizontal}`,
        marginRight: `-${offsetHorizontal}`,
        paddingLeft: offsetHorizontal,
        paddingRight: offsetHorizontal,
        transition: `background var(--p-transition-duration, ${motionDurationShort.motionDurationShort}) ${motionEasingBase.motionEasingBase}`,
    };
};
const getHoverNestedStyles = () => {
    return {
        background: themeLightStateHover.themeLightStateHover, // hover color is equal for light and dark theme
    };
};
const getHoverStyle = (opts) => {
    const { borderRadius } = opts || {};
    return {
        ...getHoverStyles(borderRadius),
        // TODO: how can we test this later in vrt?
        '@media(hover:hover)': {
            '&:hover': {
                ...getHoverNestedStyles(),
            },
        },
    };
};

exports.getHoverNestedStyles = getHoverNestedStyles;
exports.getHoverStyle = getHoverStyle;
exports.getHoverStyles = getHoverStyles;
