'use strict';

var getHoverStyle$1 = require('../../js/hover/getHoverStyle.cjs');

const getHoverStyle = (opts) => {
    const { borderRadius } = opts || {};
    return {
        ...getHoverStyle$1.getHoverStyles(borderRadius),
        '@media': {
            '(hover:hover)': {
                selectors: {
                    '&:hover': {
                        ...getHoverStyle$1.getHoverNestedStyles(),
                    },
                },
            },
        },
    };
};

exports.getHoverStyle = getHoverStyle;
