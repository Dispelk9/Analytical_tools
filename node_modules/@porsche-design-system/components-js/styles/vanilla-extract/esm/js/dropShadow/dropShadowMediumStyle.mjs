import { _dropShadowBackgroundColor } from './dropShadowShared.mjs';

const dropShadowMediumStyle = {
    boxShadow: `0px 4px 16px ${_dropShadowBackgroundColor}`, // filter: drop-shadow() causes visual glitches in Firefox in combination with frostedGlassStyle
};

export { dropShadowMediumStyle };
