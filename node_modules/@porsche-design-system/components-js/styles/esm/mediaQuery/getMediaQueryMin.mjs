import { breakpoint } from './breakpoint.mjs';

function getMediaQueryMin(min) {
    return `@media(min-width:${breakpoint[min]}px)`;
}

export { getMediaQueryMin };
