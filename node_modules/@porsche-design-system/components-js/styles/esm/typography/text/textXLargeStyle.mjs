import { _textFontPartA, _textFontPartB } from './textShared.mjs';
import { fontHyphenationStyle } from '../../font/fontHyphenationStyle.mjs';
import { fontSizeTextXLarge } from '../../font/fontSizeTextXLarge.mjs';

const textXLargeStyle = {
    font: `${_textFontPartA}${fontSizeTextXLarge}${_textFontPartB}`,
    ...fontHyphenationStyle,
};

export { textXLargeStyle };
