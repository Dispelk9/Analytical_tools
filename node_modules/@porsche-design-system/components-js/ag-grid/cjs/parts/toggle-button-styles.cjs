'use strict';

var agGridCommunity = require('ag-grid-community');
var styles = require('../styles.cjs');
var themeMode = require('../types/theme-mode.cjs');

const toggleButtonStyle = agGridCommunity.createPart({
    feature: 'toggleButtonStyle',
    params: {
        toggleButtonOnBackgroundColor: styles.themeLightNotificationSuccess,
        toggleButtonOffBackgroundColor: styles.themeLightBackgroundBase,
        toggleButtonSwitchBackgroundColor: styles.themeLightPrimary,
        toggleButtonOnHoverBackgroundColor: styles.themeLightSuccessColorDarken,
        toggleButtonOnBorderColor: styles.themeLightNotificationSuccess,
        toggleButtonOnHoverBorderColor: styles.themeLightSuccessColorDarken,
        toggleButtonOffHoverBorderColor: styles.themeLightPrimary,
        toggleButtonOffBorderColor: styles.themeLightContrastMedium,
        toggleButtonDisabledColor: styles.themeLightStateDisabled,
    },
    modeParams: {
        [themeMode.pdsThemeModeDark]: {
            toggleButtonOnBackgroundColor: styles.themeDarkNotificationSuccess,
            toggleButtonOffBackgroundColor: styles.themeDarkBackgroundBase,
            toggleButtonSwitchBackgroundColor: styles.themeDarkPrimary,
            toggleButtonOnHoverBackgroundColor: styles.themeDarkSuccessColorDarken,
            toggleButtonOnBorderColor: styles.themeDarkNotificationSuccess,
            toggleButtonOnHoverBorderColor: styles.themeDarkSuccessColorDarken,
            toggleButtonOffHoverBorderColor: styles.themeDarkPrimary,
            toggleButtonOffBorderColor: styles.themeDarkContrastMedium,
            toggleButtonDisabledColor: styles.themeDarkStateDisabled,
        },
    },
    css: `
    .ag-toggle-button-input-wrapper {
        border: ${styles.borderWidthBase} solid var(--ag-toggle-button-off-border-color);
        position: relative;

        &::before {
            height: calc(var(--ag-toggle-button-height) - ${styles.spacingStaticXSmall} * 2) !important;
            width: calc(var(--ag-toggle-button-height) - ${styles.spacingStaticXSmall} * 2) !important;
            top: calc(${styles.spacingStaticXSmall} - ${styles.borderWidthBase}) !important;
            left: calc(${styles.spacingStaticXSmall} - ${styles.borderWidthBase}) !important;
        }

        &.ag-checked {
            border-color: var(--ag-toggle-button-on-border-color);

            &::before {
                --ag-toggle-button-switch-background-color: ${styles.themeLightBackgroundBase};
                --ag-toggle-button-on-border-color: ${styles.themeLightBackgroundBase};
                left: calc(100% - var(--ag-toggle-button-height) + 6px) !important;
            }
        }

        &:not(.ag-disabled):hover {
            border-color: var(--ag-toggle-button-off-hover-border-color);
        }

        &.ag-checked:not(.ag-disabled):hover {
            border-color: var(--ag-toggle-button-on-hover-border-color);
            background-color: var(--ag-toggle-button-on-hover-background-color);
        }

        &.ag-disabled {
            opacity: 1 !important;
            border-color: var(--ag-toggle-button-disabled-color);

            &:hover input {
                cursor: not-allowed;
            }

            &:not(.ag-checked)::before {
                background-color: var(--ag-toggle-button-disabled-color);
            }

            &.ag-checked {
                background-color: var(--ag-toggle-button-disabled-color);
            }
        }
    }
  `,
});

exports.toggleButtonStyle = toggleButtonStyle;
