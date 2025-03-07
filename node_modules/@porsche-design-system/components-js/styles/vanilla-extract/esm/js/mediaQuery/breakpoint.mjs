import { breakpointBase } from './breakpointBase.mjs';
import { breakpointXS } from './breakpointXS.mjs';
import { breakpointS } from './breakpointS.mjs';
import { breakpointM } from './breakpointM.mjs';
import { breakpointL } from './breakpointL.mjs';
import { breakpointXL } from './breakpointXL.mjs';
import { breakpointXXL } from './breakpointXXL.mjs';

const breakpoint = {
    base: breakpointBase,
    xs: breakpointXS,
    s: breakpointS,
    m: breakpointM,
    l: breakpointL,
    xl: breakpointXL,
    xxl: breakpointXXL,
};

export { breakpoint };
