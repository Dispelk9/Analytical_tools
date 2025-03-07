import { _textFontPartA, _textFontPartB } from './textShared.mjs';
import { fontHyphenationStyle } from '../../font/fontHyphenationStyle.mjs';
import { fontSizeTextXXSmall } from '../../font/fontSizeTextXXSmall.mjs';

const textXXSmallStyle = {
    font: `${_textFontPartA}${fontSizeTextXXSmall}${_textFontPartB}`,
    ...fontHyphenationStyle,
};

export { textXXSmallStyle };
