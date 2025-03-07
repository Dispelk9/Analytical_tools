'use strict';

var gradientShared = require('./gradientShared.cjs');

const gradientToTopStyle = {
    background: `linear-gradient(to top, ${gradientShared._gradient} 100%);`,
};

exports.gradientToTopStyle = gradientToTopStyle;
