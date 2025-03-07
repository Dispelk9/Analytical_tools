import { breakpoint } from './breakpoint.mjs';

function getMediaQueryMinMax(min, max) {
    return `@media(min-width:${breakpoint[min]}px) and (max-width:${breakpoint[max] - 1}px)`;
}

export { getMediaQueryMinMax };
