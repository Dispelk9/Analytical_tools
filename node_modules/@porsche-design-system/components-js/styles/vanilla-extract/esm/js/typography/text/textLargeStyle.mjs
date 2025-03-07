import { _textFontPartA, _textFontPartB } from './textShared.mjs';
import { fontHyphenationStyle } from '../../font/fontHyphenationStyle.mjs';
import { fontSizeTextLarge } from '../../font/fontSizeTextLarge.mjs';

const textLargeStyle = {
    font: `${_textFontPartA}${fontSizeTextLarge}${_textFontPartB}`,
    ...fontHyphenationStyle,
};

export { textLargeStyle };
