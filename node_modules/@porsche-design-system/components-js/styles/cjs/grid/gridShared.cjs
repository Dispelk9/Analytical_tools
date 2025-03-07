'use strict';

const _cssVariableGridExtendedSpanOneHalf = '--pds-grid-extended-span-one-half';
const _cssVariableGridBasicSpanOneHalf = '--pds-grid-basic-span-one-half';
const _cssVariableGridBasicSpanOneThird = '--pds-grid-basic-span-one-third';
const _cssVariableGridBasicSpanTwoThirds = '--pds-grid-basic-span-two-thirds';
const _cssVariableGridNarrowSpanOneHalf = '--pds-grid-narrow-span-one-half';
const _cssVariableGridSafeZone = '--pds-internal-grid-safe-zone';
const _cssVariableGridOuterColumn = '--pds-internal-grid-outer-column';
const _cssVariableGridMargin = '--pds-internal-grid-margin';
const _cssVariableGridWidthMin = '--pds-internal-grid-width-min';
const _cssVariableGridWidthMax = '--pds-internal-grid-width-max';
const _gridWidthMin = '320px';
const _gridWidthMax = '2560px';
// fluid sizing calculated by https://fluidtypography.com/#app-get-started
const _gridSafeZoneBase = 'max(22px, 10.625vw - 12px)'; // viewport-width range = 320 - 760px / size range = 22 - 68.75px
const _gridSafeZoneS = 'calc(5vw - 16px)'; // viewport-width range = 760 - 1920px / size range = 22(22.75) - 80(79.71)px
const _gridSafeZoneXXL = 'min(50vw - 880px, 400px)'; // viewport-width range = 1920 - 2560px / size range = 80(79.71)px - 400(399.71)px

exports._cssVariableGridBasicSpanOneHalf = _cssVariableGridBasicSpanOneHalf;
exports._cssVariableGridBasicSpanOneThird = _cssVariableGridBasicSpanOneThird;
exports._cssVariableGridBasicSpanTwoThirds = _cssVariableGridBasicSpanTwoThirds;
exports._cssVariableGridExtendedSpanOneHalf = _cssVariableGridExtendedSpanOneHalf;
exports._cssVariableGridMargin = _cssVariableGridMargin;
exports._cssVariableGridNarrowSpanOneHalf = _cssVariableGridNarrowSpanOneHalf;
exports._cssVariableGridOuterColumn = _cssVariableGridOuterColumn;
exports._cssVariableGridSafeZone = _cssVariableGridSafeZone;
exports._cssVariableGridWidthMax = _cssVariableGridWidthMax;
exports._cssVariableGridWidthMin = _cssVariableGridWidthMin;
exports._gridSafeZoneBase = _gridSafeZoneBase;
exports._gridSafeZoneS = _gridSafeZoneS;
exports._gridSafeZoneXXL = _gridSafeZoneXXL;
exports._gridWidthMax = _gridWidthMax;
exports._gridWidthMin = _gridWidthMin;
