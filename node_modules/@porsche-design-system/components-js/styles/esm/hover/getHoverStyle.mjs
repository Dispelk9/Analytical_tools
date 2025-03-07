import { borderRadiusSmall } from '../border/borderRadiusSmall.mjs';
import { borderRadiusMedium } from '../border/borderRadiusMedium.mjs';
import { motionDurationShort } from '../motion/motionDurationShort.mjs';
import { motionEasingBase } from '../motion/motionEasingBase.mjs';
import { themeLightStateHover } from '../theme/themeLightStateHover.mjs';

const offsetHorizontal = '2px';
const getHoverStyles = (borderRadius = 'small') => {
    const borderRadiusValue = borderRadius === 'small'
        ? borderRadiusSmall
        : borderRadius === 'medium'
            ? borderRadiusMedium
            : borderRadius || borderRadiusSmall;
    return {
        borderRadius: borderRadiusValue, // it's visually being reflected on both (when placed here), element and hover
        marginLeft: `-${offsetHorizontal}`,
        marginRight: `-${offsetHorizontal}`,
        paddingLeft: offsetHorizontal,
        paddingRight: offsetHorizontal,
        transition: `background var(--p-transition-duration, ${motionDurationShort}) ${motionEasingBase}`,
    };
};
const getHoverNestedStyles = () => {
    return {
        background: themeLightStateHover, // hover color is equal for light and dark theme
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

export { getHoverNestedStyles, getHoverStyle, getHoverStyles };
