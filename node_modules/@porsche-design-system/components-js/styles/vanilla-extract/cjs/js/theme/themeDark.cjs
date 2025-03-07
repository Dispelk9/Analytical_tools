'use strict';

var themeDarkPrimary = require('./themeDarkPrimary.cjs');
var themeDarkBackgroundBase = require('./themeDarkBackgroundBase.cjs');
var themeDarkBackgroundSurface = require('./themeDarkBackgroundSurface.cjs');
var themeDarkBackgroundShading = require('./themeDarkBackgroundShading.cjs');
var themeDarkBackgroundFrosted = require('./themeDarkBackgroundFrosted.cjs');
var themeDarkContrastLow = require('./themeDarkContrastLow.cjs');
var themeDarkContrastMedium = require('./themeDarkContrastMedium.cjs');
var themeDarkContrastHigh = require('./themeDarkContrastHigh.cjs');
var themeDarkNotificationSuccess = require('./themeDarkNotificationSuccess.cjs');
var themeDarkNotificationSuccessSoft = require('./themeDarkNotificationSuccessSoft.cjs');
var themeDarkNotificationWarning = require('./themeDarkNotificationWarning.cjs');
var themeDarkNotificationWarningSoft = require('./themeDarkNotificationWarningSoft.cjs');
var themeDarkNotificationError = require('./themeDarkNotificationError.cjs');
var themeDarkNotificationErrorSoft = require('./themeDarkNotificationErrorSoft.cjs');
var themeDarkNotificationInfo = require('./themeDarkNotificationInfo.cjs');
var themeDarkNotificationInfoSoft = require('./themeDarkNotificationInfoSoft.cjs');
var themeDarkStateHover = require('./themeDarkStateHover.cjs');
var themeDarkStateActive = require('./themeDarkStateActive.cjs');
var themeDarkStateFocus = require('./themeDarkStateFocus.cjs');
var themeDarkStateDisabled = require('./themeDarkStateDisabled.cjs');

const themeDark = {
    primary: themeDarkPrimary.themeDarkPrimary,
    background: {
        base: themeDarkBackgroundBase.themeDarkBackgroundBase,
        surface: themeDarkBackgroundSurface.themeDarkBackgroundSurface,
        shading: themeDarkBackgroundShading.themeDarkBackgroundShading,
        frosted: themeDarkBackgroundFrosted.themeDarkBackgroundFrosted,
    },
    contrast: {
        low: themeDarkContrastLow.themeDarkContrastLow,
        medium: themeDarkContrastMedium.themeDarkContrastMedium,
        high: themeDarkContrastHigh.themeDarkContrastHigh,
    },
    notification: {
        success: themeDarkNotificationSuccess.themeDarkNotificationSuccess,
        successSoft: themeDarkNotificationSuccessSoft.themeDarkNotificationSuccessSoft,
        warning: themeDarkNotificationWarning.themeDarkNotificationWarning,
        warningSoft: themeDarkNotificationWarningSoft.themeDarkNotificationWarningSoft,
        error: themeDarkNotificationError.themeDarkNotificationError,
        errorSoft: themeDarkNotificationErrorSoft.themeDarkNotificationErrorSoft,
        info: themeDarkNotificationInfo.themeDarkNotificationInfo,
        infoSoft: themeDarkNotificationInfoSoft.themeDarkNotificationInfoSoft,
    },
    state: {
        hover: themeDarkStateHover.themeDarkStateHover,
        active: themeDarkStateActive.themeDarkStateActive,
        focus: themeDarkStateFocus.themeDarkStateFocus,
        disabled: themeDarkStateDisabled.themeDarkStateDisabled,
    },
};

exports.themeDark = themeDark;
