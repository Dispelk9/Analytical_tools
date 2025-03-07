'use strict';

var gradientShared = require('./gradientShared.cjs');

const gradientToLeftStyle = {
    background: `linear-gradient(to left, ${gradientShared._gradient} 100%);`,
};

exports.gradientToLeftStyle = gradientToLeftStyle;
