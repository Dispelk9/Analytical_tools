import { _textFontPartA, _textFontPartB } from './textShared.mjs';
import { fontHyphenationStyle } from '../../font/fontHyphenationStyle.mjs';
import { fontSizeTextMedium } from '../../font/fontSizeTextMedium.mjs';

const textMediumStyle = {
    font: `${_textFontPartA}${fontSizeTextMedium}${_textFontPartB}`,
    ...fontHyphenationStyle,
};

export { textMediumStyle };
