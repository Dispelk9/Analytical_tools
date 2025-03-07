import { _dropShadowBackgroundColor } from './dropShadowShared.mjs';

const dropShadowLowStyle = {
    boxShadow: `0px 3px 8px ${_dropShadowBackgroundColor}`, // filter: drop-shadow() causes visual glitches in Firefox in combination with frostedGlassStyle
};

export { dropShadowLowStyle };
