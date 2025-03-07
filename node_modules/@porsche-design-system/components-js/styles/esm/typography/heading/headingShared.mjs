import { fontFamily } from '../../font/fontFamily.mjs';
import { fontLineHeight } from '../../font/fontLineHeight.mjs';
import { fontWeightSemiBold } from '../../font/fontWeightSemiBold.mjs';
import { fontStyleNormal } from '../../font/fontStyleNormal.mjs';
import { fontVariant } from '../../font/fontVariant.mjs';

const _headingFontPartA = `${fontStyleNormal} ${fontVariant} ${fontWeightSemiBold} `;
const _headingFontPartB = `/${fontLineHeight} ${fontFamily}`;

export { _headingFontPartA, _headingFontPartB };
