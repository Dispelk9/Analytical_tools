'use strict';

var agGridCommunity = require('ag-grid-community');
var checkboxStyles = require('../parts/checkbox-styles.cjs');
var iconSet = require('../parts/icon-set.cjs');
var toggleButtonStyles = require('../parts/toggle-button-styles.cjs');
var styles = require('../styles.cjs');
var themeMode = require('../types/theme-mode.cjs');

const pdsTheme = agGridCommunity.themeQuartz
    .withParams({
    checkboxBorderWidth: 2,
    checkboxBorderRadius: styles.borderRadiusSmall,
    focusShadow: 'none',
    inputFocusShadow: 'none',
    spacing: 10,
    toggleButtonHeight: 28,
    toggleButtonWidth: 48,
    iconSize: 24,
    borderRadius: styles.borderRadiusSmall,
    wrapperBorderRadius: styles.borderRadiusMedium,
    fontFamily: styles.fontFamily,
    fontSize: styles.fontSizeTextSmall,
    headerFontWeight: styles.fontWeightSemiBold,
    headerFontSize: styles.fontSizeTextXSmall,
    headerHeight: 'calc(var(--ag-font-size) + var(--ag-spacing) * 2.9)',
    rowHeight: 'calc(var(--ag-font-size) + var(--ag-spacing) * 4)',
    toggleButtonSwitchInset: 3,
    browserColorScheme: 'light',
    accentColor: styles.themeLightNotificationInfo,
    backgroundColor: styles.themeLightBackgroundBase,
    foregroundColor: styles.themeLightPrimary,
    headerBackgroundColor: styles.themeLightBackgroundSurface,
    selectedRowBackgroundColor: styles.themeLightBackgroundSurfaceDarken,
    oddRowBackgroundColor: styles.themeLightBackgroundSurface,
    modalOverlayBackgroundColor: styles.themeLightBackgroundFrosted,
    rowHoverColor: styles.themeLightStateHover,
    columnHoverColor: styles.themeLightStateHover,
    rangeSelectionBorderColor: styles.themeLightStateFocus,
    borderColor: styles.themeLightContrastLow,
    inputBorder: `1px solid ${styles.themeLightContrastMedium}`,
    inputInvalidBorder: `1px solid ${styles.themeLightNotificationError}`,
    inputDisabledBorder: `1px solid ${styles.themeLightStateDisabled}`,
    inputDisabledBackgroundColor: styles.themeLightBackgroundBase,
    invalidColor: styles.themeLightNotificationError,
    inputFocusBorder: `1px solid ${styles.themeLightPrimary}`,
})
    .withParams({
    browserColorScheme: 'dark',
    accentColor: styles.themeDarkNotificationInfo,
    backgroundColor: styles.themeDarkBackgroundBase,
    foregroundColor: styles.themeDarkPrimary,
    headerBackgroundColor: styles.themeDarkBackgroundSurface,
    selectedRowBackgroundColor: styles.themeDarkBackgroundSurfaceDarken,
    oddRowBackgroundColor: styles.themeDarkBackgroundSurface,
    modalOverlayBackgroundColor: styles.themeDarkBackgroundFrosted,
    rowHoverColor: styles.themeDarkStateHover,
    columnHoverColor: styles.themeDarkStateHover,
    rangeSelectionBorderColor: styles.themeDarkStateFocus,
    borderColor: styles.themeDarkContrastLow,
    inputBorder: `1px solid ${styles.themeDarkContrastMedium}`,
    inputInvalidBorder: `1px solid ${styles.themeDarkNotificationError}`,
    inputDisabledBorder: `1px solid ${styles.themeDarkStateDisabled}`,
    inputDisabledBackgroundColor: styles.themeDarkBackgroundBase,
    invalidColor: styles.themeDarkNotificationError,
    inputFocusBorder: `1px solid ${styles.themeDarkPrimary}`,
}, themeMode.pdsThemeModeDark)
    .withPart(iconSet.pdsSvgIcons)
    .withPart(toggleButtonStyles.toggleButtonStyle)
    .withPart(checkboxStyles.checkboxStyle);

exports.pdsTheme = pdsTheme;
