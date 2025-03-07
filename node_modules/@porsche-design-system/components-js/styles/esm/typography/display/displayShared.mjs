import { fontFamily } from '../../font/fontFamily.mjs';
import { fontLineHeight } from '../../font/fontLineHeight.mjs';
import { fontWeightRegular } from '../../font/fontWeightRegular.mjs';
import { fontStyleNormal } from '../../font/fontStyleNormal.mjs';
import { fontVariant } from '../../font/fontVariant.mjs';

const _displayFontPartA = `${fontStyleNormal} ${fontVariant} ${fontWeightRegular} `;
const _displayFontPartB = `/${fontLineHeight} ${fontFamily}`;

export { _displayFontPartA, _displayFontPartB };
