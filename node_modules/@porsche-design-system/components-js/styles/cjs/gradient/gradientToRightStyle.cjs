'use strict';

var gradientShared = require('./gradientShared.cjs');

const gradientToRightStyle = {
    background: `linear-gradient(to right, ${gradientShared._gradient} 100%);`,
};

exports.gradientToRightStyle = gradientToRightStyle;
