import { themeDarkPrimary } from './themeDarkPrimary.mjs';
import { themeDarkBackgroundBase } from './themeDarkBackgroundBase.mjs';
import { themeDarkBackgroundSurface } from './themeDarkBackgroundSurface.mjs';
import { themeDarkBackgroundShading } from './themeDarkBackgroundShading.mjs';
import { themeDarkBackgroundFrosted } from './themeDarkBackgroundFrosted.mjs';
import { themeDarkContrastLow } from './themeDarkContrastLow.mjs';
import { themeDarkContrastMedium } from './themeDarkContrastMedium.mjs';
import { themeDarkContrastHigh } from './themeDarkContrastHigh.mjs';
import { themeDarkNotificationSuccess } from './themeDarkNotificationSuccess.mjs';
import { themeDarkNotificationSuccessSoft } from './themeDarkNotificationSuccessSoft.mjs';
import { themeDarkNotificationWarning } from './themeDarkNotificationWarning.mjs';
import { themeDarkNotificationWarningSoft } from './themeDarkNotificationWarningSoft.mjs';
import { themeDarkNotificationError } from './themeDarkNotificationError.mjs';
import { themeDarkNotificationErrorSoft } from './themeDarkNotificationErrorSoft.mjs';
import { themeDarkNotificationInfo } from './themeDarkNotificationInfo.mjs';
import { themeDarkNotificationInfoSoft } from './themeDarkNotificationInfoSoft.mjs';
import { themeDarkStateHover } from './themeDarkStateHover.mjs';
import { themeDarkStateActive } from './themeDarkStateActive.mjs';
import { themeDarkStateFocus } from './themeDarkStateFocus.mjs';
import { themeDarkStateDisabled } from './themeDarkStateDisabled.mjs';

const themeDark = {
    primary: themeDarkPrimary,
    background: {
        base: themeDarkBackgroundBase,
        surface: themeDarkBackgroundSurface,
        shading: themeDarkBackgroundShading,
        frosted: themeDarkBackgroundFrosted,
    },
    contrast: {
        low: themeDarkContrastLow,
        medium: themeDarkContrastMedium,
        high: themeDarkContrastHigh,
    },
    notification: {
        success: themeDarkNotificationSuccess,
        successSoft: themeDarkNotificationSuccessSoft,
        warning: themeDarkNotificationWarning,
        warningSoft: themeDarkNotificationWarningSoft,
        error: themeDarkNotificationError,
        errorSoft: themeDarkNotificationErrorSoft,
        info: themeDarkNotificationInfo,
        infoSoft: themeDarkNotificationInfoSoft,
    },
    state: {
        hover: themeDarkStateHover,
        active: themeDarkStateActive,
        focus: themeDarkStateFocus,
        disabled: themeDarkStateDisabled,
    },
};

export { themeDark };
