import { _displayFontPartA, _displayFontPartB } from './displayShared.mjs';
import { fontSizeDisplayMedium } from '../../font/fontSizeDisplayMedium.mjs';

const displayMediumStyle = {
    font: `${_displayFontPartA}${fontSizeDisplayMedium}${_displayFontPartB}`,
};

export { displayMediumStyle };
