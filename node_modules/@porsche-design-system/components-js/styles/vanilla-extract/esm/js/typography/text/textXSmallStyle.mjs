import { _textFontPartA, _textFontPartB } from './textShared.mjs';
import { fontHyphenationStyle } from '../../font/fontHyphenationStyle.mjs';
import { fontSizeTextXSmall } from '../../font/fontSizeTextXSmall.mjs';

const textXSmallStyle = {
    font: `${_textFontPartA}${fontSizeTextXSmall}${_textFontPartB}`,
    ...fontHyphenationStyle,
};

export { textXSmallStyle };
