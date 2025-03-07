import '../../js/grid/gridStyle.mjs';
import '../../js/grid/gridExtendedOffsetS.mjs';
import '../../js/grid/gridExtendedOffsetXXL.mjs';
import '../../js/grid/gridBasicOffsetS.mjs';
import '../../js/grid/gridBasicOffsetXXL.mjs';
import '../../js/grid/gridNarrowOffsetS.mjs';
import '../../js/grid/gridNarrowOffsetXXL.mjs';
import { breakpoint } from '../../js/mediaQuery/breakpoint.mjs';
import '../../js/typography/text/textXXSmallStyle.mjs';
import '../../js/typography/text/textXSmallStyle.mjs';
import '../../js/typography/text/textSmallStyle.mjs';
import '../../js/typography/text/textMediumStyle.mjs';
import '../../js/typography/text/textLargeStyle.mjs';
import '../../js/typography/text/textXLargeStyle.mjs';

function getMediaQueryMin(min) {
    return `(min-width:${breakpoint[min]}px)`;
}

export { getMediaQueryMin };
