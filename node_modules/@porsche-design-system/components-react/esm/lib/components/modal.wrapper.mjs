"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { useEventCallback, usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';

const PModal = /*#__PURE__*/ forwardRef(({ aria, backdrop = 'blur', disableBackdropClick = false, disableCloseButton, dismissButton = true, fullscreen = false, heading, onClose, onDismiss, onMotionHiddenEnd, onMotionVisibleEnd, open = false, theme, className, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    useEventCallback(elementRef, 'close', onClose);
    useEventCallback(elementRef, 'dismiss', onDismiss);
    useEventCallback(elementRef, 'motionHiddenEnd', onMotionHiddenEnd);
    useEventCallback(elementRef, 'motionVisibleEnd', onMotionVisibleEnd);
    const WebComponentTag = usePrefix('p-modal');
    const propsToSync = [aria, backdrop, disableBackdropClick, disableCloseButton, dismissButton, fullscreen, heading, open, theme || useTheme()];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['aria', 'backdrop', 'disableBackdropClick', 'disableCloseButton', 'dismissButton', 'fullscreen', 'heading', 'open', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: useMergedClass(elementRef, className),
        ref: syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsx(WebComponentTag, { ...props });
});

export { PModal };
