import { fontFamily } from '../../font/fontFamily.mjs';
import { fontLineHeight } from '../../font/fontLineHeight.mjs';
import { fontWeightRegular } from '../../font/fontWeightRegular.mjs';
import { fontStyleNormal } from '../../font/fontStyleNormal.mjs';
import { fontVariant } from '../../font/fontVariant.mjs';

const _textFontPartA = `${fontStyleNormal} ${fontVariant} ${fontWeightRegular} `;
const _textFontPartB = `/${fontLineHeight} ${fontFamily}`;

export { _textFontPartA, _textFontPartB };
