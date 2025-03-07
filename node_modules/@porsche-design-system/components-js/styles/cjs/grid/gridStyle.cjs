'use strict';

var getMediaQueryMin = require('../mediaQuery/getMediaQueryMin.cjs');
var gridGap = require('./gridGap.cjs');
var gridFullColumnStart = require('./gridFullColumnStart.cjs');
var gridWideColumnStart = require('./gridWideColumnStart.cjs');
var gridExtendedColumnStart = require('./gridExtendedColumnStart.cjs');
var gridBasicColumnStart = require('./gridBasicColumnStart.cjs');
var gridNarrowColumnStart = require('./gridNarrowColumnStart.cjs');
var gridNarrowColumnEnd = require('./gridNarrowColumnEnd.cjs');
var gridBasicColumnEnd = require('./gridBasicColumnEnd.cjs');
var gridExtendedColumnEnd = require('./gridExtendedColumnEnd.cjs');
var gridWideColumnEnd = require('./gridWideColumnEnd.cjs');
var gridFullColumnEnd = require('./gridFullColumnEnd.cjs');
var gridShared = require('./gridShared.cjs');

// _cssVariableGridOuterColumn is needed in case behaviour needs to be adjusted like when used in Flyout or Modal
const outerColumn = `minmax(0,var(${gridShared._cssVariableGridOuterColumn},calc(var(${gridShared._cssVariableGridSafeZone}) - ${gridGap.gridGap})))`;
const column = 'minmax(0,1fr)';
const getColumns = (repeat) => (repeat > 1 ? `repeat(${repeat}, ${column})` : column);
const getColumnSpan = (span) => `span ${span}`;
const getGridTemplateColumns = (layout) => layout === 'mobile'
    ? `[${gridFullColumnStart.gridFullColumnStart}] ${outerColumn} [${gridWideColumnStart.gridWideColumnStart} ${gridExtendedColumnStart.gridExtendedColumnStart} ${gridBasicColumnStart.gridBasicColumnStart} ${gridNarrowColumnStart.gridNarrowColumnStart}] ${getColumns(6)} [${gridNarrowColumnEnd.gridNarrowColumnEnd} ${gridBasicColumnEnd.gridBasicColumnEnd} ${gridExtendedColumnEnd.gridExtendedColumnEnd} ${gridWideColumnEnd.gridWideColumnEnd}] ${outerColumn} [${gridFullColumnEnd.gridFullColumnEnd}]`
    : `[${gridFullColumnStart.gridFullColumnStart}] ${outerColumn} [${gridWideColumnStart.gridWideColumnStart}] ${getColumns(1)} [${gridExtendedColumnStart.gridExtendedColumnStart}] ${getColumns(1)} [${gridBasicColumnStart.gridBasicColumnStart}] ${getColumns(2)} [${gridNarrowColumnStart.gridNarrowColumnStart}] ${getColumns(8)} [${gridNarrowColumnEnd.gridNarrowColumnEnd}] ${getColumns(2)} [${gridBasicColumnEnd.gridBasicColumnEnd}] ${getColumns(1)} [${gridExtendedColumnEnd.gridExtendedColumnEnd}] ${getColumns(1)} [${gridWideColumnEnd.gridWideColumnEnd}] ${outerColumn} [${gridFullColumnEnd.gridFullColumnEnd}]`;
const gridStyle = {
    [gridShared._cssVariableGridSafeZone]: gridShared._gridSafeZoneBase,
    [gridShared._cssVariableGridExtendedSpanOneHalf]: getColumnSpan(3),
    [gridShared._cssVariableGridBasicSpanOneHalf]: getColumnSpan(3),
    [gridShared._cssVariableGridBasicSpanOneThird]: getColumnSpan(2),
    [gridShared._cssVariableGridBasicSpanTwoThirds]: getColumnSpan(4),
    [gridShared._cssVariableGridNarrowSpanOneHalf]: getColumnSpan(3),
    display: 'grid',
    gridGap: gridGap.gridGap,
    gridTemplateColumns: getGridTemplateColumns('mobile'),
    // _cssVariableGridWidthMin, _cssVariableGridWidthMax and _cssVariableGridMargin is needed in case behaviour needs to be adjusted like when used in Flyout or Modal
    minWidth: `var(${gridShared._cssVariableGridWidthMin},${gridShared._gridWidthMin})`,
    maxWidth: `var(${gridShared._cssVariableGridWidthMax},${gridShared._gridWidthMax})`,
    margin: `0 var(${gridShared._cssVariableGridMargin},0)`,
    padding: `0 calc(50% - var(${gridShared._cssVariableGridMargin},0px) - ${gridShared._gridWidthMax} / 2)`,
    boxSizing: 'content-box',
    [getMediaQueryMin.getMediaQueryMin('s')]: {
        [gridShared._cssVariableGridSafeZone]: gridShared._gridSafeZoneS,
        [gridShared._cssVariableGridExtendedSpanOneHalf]: getColumnSpan(7),
        [gridShared._cssVariableGridBasicSpanOneHalf]: getColumnSpan(6),
        [gridShared._cssVariableGridBasicSpanOneThird]: getColumnSpan(4),
        [gridShared._cssVariableGridBasicSpanTwoThirds]: getColumnSpan(8),
        [gridShared._cssVariableGridNarrowSpanOneHalf]: getColumnSpan(4),
        gridTemplateColumns: getGridTemplateColumns('desktop'),
    },
    [getMediaQueryMin.getMediaQueryMin('xxl')]: {
        [gridShared._cssVariableGridSafeZone]: gridShared._gridSafeZoneXXL,
    },
};

exports.gridStyle = gridStyle;
