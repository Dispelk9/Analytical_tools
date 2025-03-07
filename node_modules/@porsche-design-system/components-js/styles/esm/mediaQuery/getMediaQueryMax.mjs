import { breakpoint } from './breakpoint.mjs';

function getMediaQueryMax(max) {
    return `@media(max-width:${breakpoint[max] - 1}px)`;
}

export { getMediaQueryMax };
