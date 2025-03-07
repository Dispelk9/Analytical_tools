'use strict';

var gridShared = require('./gridShared.cjs');
var gridGap = require('./gridGap.cjs');

const columnMap = {
    narrow: 4,
    basic: 2,
    extended: 1,
};
const gridColumnWidthS = `calc((100vw - ${gridShared._gridSafeZoneS} * 2 - ${gridGap.gridGap} * 15) / 16)`;
const gridColumnWidthXXL = `calc((min(100vw, ${gridShared._gridWidthMax}) - ${gridShared._gridSafeZoneXXL} * 2 - ${gridGap.gridGap} * 15) / 16)`;
const _gridPadding = `max(0px, 50vw - ${gridShared._gridWidthMax} / 2)`;
const _getGridOffsetS = (width) => `calc(${gridShared._gridSafeZoneS} + (${gridGap.gridGap} + ${gridColumnWidthS}) * ${columnMap[width]})`;
const _getGridOffsetXXL = (width) => `calc(${_gridPadding} + ${gridShared._gridSafeZoneXXL} + (${gridGap.gridGap} + ${gridColumnWidthXXL}) * ${columnMap[width]})`;

exports._getGridOffsetS = _getGridOffsetS;
exports._getGridOffsetXXL = _getGridOffsetXXL;
exports._gridPadding = _gridPadding;
