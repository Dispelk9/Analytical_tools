import { themeLightPrimary } from './themeLightPrimary.mjs';
import { themeLightBackgroundBase } from './themeLightBackgroundBase.mjs';
import { themeLightBackgroundSurface } from './themeLightBackgroundSurface.mjs';
import { themeLightBackgroundShading } from './themeLightBackgroundShading.mjs';
import { themeLightBackgroundFrosted } from './themeLightBackgroundFrosted.mjs';
import { themeLightContrastLow } from './themeLightContrastLow.mjs';
import { themeLightContrastMedium } from './themeLightContrastMedium.mjs';
import { themeLightContrastHigh } from './themeLightContrastHigh.mjs';
import { themeLightNotificationSuccess } from './themeLightNotificationSuccess.mjs';
import { themeLightNotificationSuccessSoft } from './themeLightNotificationSuccessSoft.mjs';
import { themeLightNotificationWarning } from './themeLightNotificationWarning.mjs';
import { themeLightNotificationWarningSoft } from './themeLightNotificationWarningSoft.mjs';
import { themeLightNotificationError } from './themeLightNotificationError.mjs';
import { themeLightNotificationErrorSoft } from './themeLightNotificationErrorSoft.mjs';
import { themeLightNotificationInfo } from './themeLightNotificationInfo.mjs';
import { themeLightNotificationInfoSoft } from './themeLightNotificationInfoSoft.mjs';
import { themeLightStateHover } from './themeLightStateHover.mjs';
import { themeLightStateActive } from './themeLightStateActive.mjs';
import { themeLightStateFocus } from './themeLightStateFocus.mjs';
import { themeLightStateDisabled } from './themeLightStateDisabled.mjs';

const themeLight = {
    primary: themeLightPrimary,
    background: {
        base: themeLightBackgroundBase,
        surface: themeLightBackgroundSurface,
        shading: themeLightBackgroundShading,
        frosted: themeLightBackgroundFrosted,
    },
    contrast: {
        low: themeLightContrastLow,
        medium: themeLightContrastMedium,
        high: themeLightContrastHigh,
    },
    notification: {
        success: themeLightNotificationSuccess,
        successSoft: themeLightNotificationSuccessSoft,
        warning: themeLightNotificationWarning,
        warningSoft: themeLightNotificationWarningSoft,
        error: themeLightNotificationError,
        errorSoft: themeLightNotificationErrorSoft,
        info: themeLightNotificationInfo,
        infoSoft: themeLightNotificationInfoSoft,
    },
    state: {
        hover: themeLightStateHover,
        active: themeLightStateActive,
        focus: themeLightStateFocus,
        disabled: themeLightStateDisabled,
    },
};

export { themeLight };
