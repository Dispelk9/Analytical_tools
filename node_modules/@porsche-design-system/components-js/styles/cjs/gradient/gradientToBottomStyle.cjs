'use strict';

var gradientShared = require('./gradientShared.cjs');

const gradientToBottomStyle = {
    background: `linear-gradient(to bottom, ${gradientShared._gradient} 100%);`,
};

exports.gradientToBottomStyle = gradientToBottomStyle;
