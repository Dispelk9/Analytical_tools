'use strict';

require('../../js/grid/gridStyle.cjs');
require('../../js/grid/gridExtendedOffsetS.cjs');
require('../../js/grid/gridExtendedOffsetXXL.cjs');
require('../../js/grid/gridBasicOffsetS.cjs');
require('../../js/grid/gridBasicOffsetXXL.cjs');
require('../../js/grid/gridNarrowOffsetS.cjs');
require('../../js/grid/gridNarrowOffsetXXL.cjs');
var breakpoint = require('../../js/mediaQuery/breakpoint.cjs');
require('../../js/typography/text/textXXSmallStyle.cjs');
require('../../js/typography/text/textXSmallStyle.cjs');
require('../../js/typography/text/textSmallStyle.cjs');
require('../../js/typography/text/textMediumStyle.cjs');
require('../../js/typography/text/textLargeStyle.cjs');
require('../../js/typography/text/textXLargeStyle.cjs');

function getMediaQueryMinMax(min, max) {
    return `(min-width:${breakpoint.breakpoint[min]}px) and (max-width:${breakpoint.breakpoint[max] - 1}px)`;
}

exports.getMediaQueryMinMax = getMediaQueryMinMax;
