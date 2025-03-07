'use strict';

var getFocusStyle$1 = require('../../js/focus/getFocusStyle.cjs');

const getFocusStyle = (opts) => {
    const { borderRadius, offset } = opts || {};
    return {
        ...getFocusStyle$1.getFocusStyles(borderRadius),
        selectors: {
            ...getFocusStyle$1.getFocusNestedStyles(offset),
        },
    };
};

exports.getFocusStyle = getFocusStyle;
