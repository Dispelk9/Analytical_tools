'use strict';

var borderRadiusSmall = require('../border/borderRadiusSmall.cjs');
var borderRadiusMedium = require('../border/borderRadiusMedium.cjs');
var borderWidthBase = require('../border/borderWidthBase.cjs');
var themeLightStateFocus = require('../theme/themeLightStateFocus.cjs');

const getFocusStyles = (borderRadius = 'small') => {
    const borderRadiusValue = borderRadius === 'small'
        ? borderRadiusSmall.borderRadiusSmall
        : borderRadius === 'medium'
            ? borderRadiusMedium.borderRadiusMedium
            : borderRadius || borderRadiusSmall.borderRadiusSmall;
    return {
        // TODO: borderRadius should be removed from interface
        // TODO: evaluate if '&::-moz-focus-inner': { border: 0 } is useful/needed for FF
        borderRadius: borderRadiusValue, // it's visually being reflected on both (when placed here), element and focus outline
    };
};
const getFocusNestedStyles = (offset = '2px') => {
    const outlineOffset = offset === 'small' ? '2px' : offset === 'none' ? 0 : offset || '2px';
    return {
        '&:focus': {
            outline: `${borderWidthBase.borderWidthBase} solid ${themeLightStateFocus.themeLightStateFocus}`,
            outlineOffset,
        },
        // why? have a look at this article https://tpgi.com/focus-visible-and-backwards-compatibility/
        '&:focus:not(:focus-visible)': {
            outlineColor: 'transparent',
        },
    };
};

exports.getFocusNestedStyles = getFocusNestedStyles;
exports.getFocusStyles = getFocusStyles;
