import { _textFontPartA, _textFontPartB } from './textShared.mjs';
import { fontHyphenationStyle } from '../../font/fontHyphenationStyle.mjs';
import { fontSizeTextSmall } from '../../font/fontSizeTextSmall.mjs';

const textSmallStyle = {
    font: `${_textFontPartA}${fontSizeTextSmall}${_textFontPartB}`,
    ...fontHyphenationStyle,
};

export { textSmallStyle };
