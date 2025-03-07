'use strict';

var agGridCommunity = require('ag-grid-community');
var styles = require('../styles.cjs');
var themeMode = require('../types/theme-mode.cjs');

const checkboxCheckedShapeImage = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m20.22,7.47l-1.47-1.42-9.26,9.02-4.24-4.15-1.47,1.42,5.71,5.6,10.73-10.47Z"/></svg>`;
const checkboxIndeterminateShapeImage = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m20,11v2H4v-2h16Z"/></svg>`;
const radioCheckedShapeImage = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6"/></svg>`;
const checkboxStyle = agGridCommunity.createPart({
    feature: 'checkboxStyle',
    params: {
        checkboxUncheckedBackgroundColor: { ref: 'backgroundColor' },
        checkboxCheckedShapeColor: { ref: 'backgroundColor' },
        checkboxCheckedShapeImage: { svg: checkboxCheckedShapeImage },
        checkboxIndeterminateShapeImage: { svg: checkboxIndeterminateShapeImage },
        radioCheckedShapeImage: { svg: radioCheckedShapeImage },
        checkboxCheckedBackgroundColor: styles.themeLightPrimary,
        checkboxCheckedBorderColor: styles.themeLightPrimary,
        checkboxUncheckedBorderColor: styles.themeLightContrastMedium,
        checkboxIndeterminateBorderColor: styles.themeLightContrastMedium,
        checkboxIndeterminateBackgroundColor: styles.themeLightBackgroundBase,
        checkboxIndeterminateShapeColor: styles.themeLightPrimary,
        checkboxUncheckedHoverBorderColor: styles.themeLightPrimary,
        checkboxCheckedHoverBorderColor: styles.themeLightContrastHigh,
        checkboxCheckedHoverBackgroundColor: styles.themeLightContrastHigh,
        checkboxDisabledColor: styles.themeLightStateDisabled,
    },
    modeParams: {
        [themeMode.pdsThemeModeDark]: {
            checkboxUncheckedBackgroundColor: { ref: 'backgroundColor' },
            checkboxCheckedShapeColor: { ref: 'backgroundColor' },
            checkboxCheckedShapeImage: { svg: checkboxCheckedShapeImage },
            checkboxIndeterminateShapeImage: { svg: checkboxIndeterminateShapeImage },
            radioCheckedShapeImage: { svg: radioCheckedShapeImage },
            checkboxCheckedBackgroundColor: styles.themeDarkPrimary,
            checkboxCheckedBorderColor: styles.themeDarkPrimary,
            checkboxUncheckedBorderColor: styles.themeDarkContrastMedium,
            checkboxIndeterminateBorderColor: styles.themeDarkContrastMedium,
            checkboxIndeterminateBackgroundColor: styles.themeDarkBackgroundBase,
            checkboxIndeterminateShapeColor: styles.themeDarkPrimary,
            checkboxUncheckedHoverBorderColor: styles.themeDarkPrimary,
            checkboxCheckedHoverBorderColor: styles.themeDarkContrastHigh,
            checkboxCheckedHoverBackgroundColor: styles.themeDarkContrastHigh,
            checkboxDisabledColor: styles.themeDarkStateDisabled,
        },
    },
    css: `
    .ag-checkbox-input-wrapper,
    .ag-radio-button-input-wrapper {
        flex: none;
        position: relative;
        width: var(--ag-icon-size);
        height: var(--ag-icon-size);
        background-color: var(--ag-checkbox-unchecked-background-color);
        border: solid var(--ag-checkbox-border-width) var(--ag-checkbox-unchecked-border-color);

        :where(input) {
            cursor: pointer;
            appearance: none;
            opacity: 0;
            margin: 0;
            display: block;
            width: 100%;
            height: 100%;
        }

        &::after {
            content: '';
            position: absolute;
            inset: 0;
            display: block;
            mask-position: center;
            mask-repeat: no-repeat;
            pointer-events: none;
        }

        &.ag-checked {
            background-color: var(--ag-checkbox-checked-background-color);
            border-color: var(--ag-checkbox-checked-border-color);

            &::after {
                background-color: var(--ag-checkbox-checked-shape-color);
            }
        }

        &:focus-within,
        &:active {
            box-shadow: var(--ag-focus-shadow);
        }

        &.ag-disabled {
            opacity: 1;
            filter: unset;
            border-color: var(--ag-checkbox-disabled-color);

            &.ag-checked {
                background-color: var(--ag-checkbox-disabled-color);
            }

            &:hover input {
                cursor: not-allowed;
            }
        }

        &:not(.ag-disabled):hover {
            border-color: var(--ag-checkbox-unchecked-hover-border-color) !important;
        }

        &.ag-checked:not(.ag-disabled):hover {
            border-color: var(--ag-checkbox-checked-hover-border-color) !important;
            background-color: var(--ag-checkbox-checked-hover-background-color) !important;
        }
    }

    .ag-checkbox-input-wrapper {
        border-radius: var(--ag-checkbox-border-radius);

        &.ag-checked::after {
            mask-image: var(--ag-checkbox-checked-shape-image);
        }

        &.ag-indeterminate {
            background-color: var(--ag-checkbox-indeterminate-background-color);
            border-color: var(--ag-checkbox-indeterminate-border-color);

            &::after {
                background-color: var(--ag-checkbox-indeterminate-shape-color);
                mask-image: var(--ag-checkbox-indeterminate-shape-image);
            }
        }
    }

    .ag-radio-button-input-wrapper {
        border-radius: 50%;

        &.ag-checked::after {
            mask-image: var(--ag-radio-checked-shape-image);
        }
    }
  `,
});

exports.checkboxCheckedShapeImage = checkboxCheckedShapeImage;
exports.checkboxIndeterminateShapeImage = checkboxIndeterminateShapeImage;
exports.checkboxStyle = checkboxStyle;
exports.radioCheckedShapeImage = radioCheckedShapeImage;
