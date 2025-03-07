import { _displayFontPartA, _displayFontPartB } from './displayShared.mjs';
import { fontSizeDisplaySmall } from '../../font/fontSizeDisplaySmall.mjs';

const displaySmallStyle = {
    font: `${_displayFontPartA}${fontSizeDisplaySmall}${_displayFontPartB}`,
};

export { displaySmallStyle };
