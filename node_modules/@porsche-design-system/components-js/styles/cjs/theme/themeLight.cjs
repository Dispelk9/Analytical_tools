'use strict';

var themeLightPrimary = require('./themeLightPrimary.cjs');
var themeLightBackgroundBase = require('./themeLightBackgroundBase.cjs');
var themeLightBackgroundSurface = require('./themeLightBackgroundSurface.cjs');
var themeLightBackgroundShading = require('./themeLightBackgroundShading.cjs');
var themeLightBackgroundFrosted = require('./themeLightBackgroundFrosted.cjs');
var themeLightContrastLow = require('./themeLightContrastLow.cjs');
var themeLightContrastMedium = require('./themeLightContrastMedium.cjs');
var themeLightContrastHigh = require('./themeLightContrastHigh.cjs');
var themeLightNotificationSuccess = require('./themeLightNotificationSuccess.cjs');
var themeLightNotificationSuccessSoft = require('./themeLightNotificationSuccessSoft.cjs');
var themeLightNotificationWarning = require('./themeLightNotificationWarning.cjs');
var themeLightNotificationWarningSoft = require('./themeLightNotificationWarningSoft.cjs');
var themeLightNotificationError = require('./themeLightNotificationError.cjs');
var themeLightNotificationErrorSoft = require('./themeLightNotificationErrorSoft.cjs');
var themeLightNotificationInfo = require('./themeLightNotificationInfo.cjs');
var themeLightNotificationInfoSoft = require('./themeLightNotificationInfoSoft.cjs');
var themeLightStateHover = require('./themeLightStateHover.cjs');
var themeLightStateActive = require('./themeLightStateActive.cjs');
var themeLightStateFocus = require('./themeLightStateFocus.cjs');
var themeLightStateDisabled = require('./themeLightStateDisabled.cjs');

const themeLight = {
    primary: themeLightPrimary.themeLightPrimary,
    background: {
        base: themeLightBackgroundBase.themeLightBackgroundBase,
        surface: themeLightBackgroundSurface.themeLightBackgroundSurface,
        shading: themeLightBackgroundShading.themeLightBackgroundShading,
        frosted: themeLightBackgroundFrosted.themeLightBackgroundFrosted,
    },
    contrast: {
        low: themeLightContrastLow.themeLightContrastLow,
        medium: themeLightContrastMedium.themeLightContrastMedium,
        high: themeLightContrastHigh.themeLightContrastHigh,
    },
    notification: {
        success: themeLightNotificationSuccess.themeLightNotificationSuccess,
        successSoft: themeLightNotificationSuccessSoft.themeLightNotificationSuccessSoft,
        warning: themeLightNotificationWarning.themeLightNotificationWarning,
        warningSoft: themeLightNotificationWarningSoft.themeLightNotificationWarningSoft,
        error: themeLightNotificationError.themeLightNotificationError,
        errorSoft: themeLightNotificationErrorSoft.themeLightNotificationErrorSoft,
        info: themeLightNotificationInfo.themeLightNotificationInfo,
        infoSoft: themeLightNotificationInfoSoft.themeLightNotificationInfoSoft,
    },
    state: {
        hover: themeLightStateHover.themeLightStateHover,
        active: themeLightStateActive.themeLightStateActive,
        focus: themeLightStateFocus.themeLightStateFocus,
        disabled: themeLightStateDisabled.themeLightStateDisabled,
    },
};

exports.themeLight = themeLight;
