import { _dropShadowBackgroundColor } from './dropShadowShared.mjs';

const dropShadowHighStyle = {
    boxShadow: `0px 8px 40px ${_dropShadowBackgroundColor}`, // filter: drop-shadow() causes visual glitches in Firefox in combination with frostedGlassStyle
};

export { dropShadowHighStyle };
