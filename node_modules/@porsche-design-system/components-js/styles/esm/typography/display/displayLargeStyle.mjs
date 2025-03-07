import { _displayFontPartA, _displayFontPartB } from './displayShared.mjs';
import { fontSizeDisplayLarge } from '../../font/fontSizeDisplayLarge.mjs';

const displayLargeStyle = {
    font: `${_displayFontPartA}${fontSizeDisplayLarge}${_displayFontPartB}`,
};

export { displayLargeStyle };
