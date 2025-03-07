"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');

const PModal = /*#__PURE__*/ react.forwardRef(({ aria, backdrop = 'blur', disableBackdropClick = false, disableCloseButton, dismissButton = true, fullscreen = false, heading, onClose, onDismiss, onMotionHiddenEnd, onMotionVisibleEnd, open = false, theme, className, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    hooks.useEventCallback(elementRef, 'close', onClose);
    hooks.useEventCallback(elementRef, 'dismiss', onDismiss);
    hooks.useEventCallback(elementRef, 'motionHiddenEnd', onMotionHiddenEnd);
    hooks.useEventCallback(elementRef, 'motionVisibleEnd', onMotionVisibleEnd);
    const WebComponentTag = hooks.usePrefix('p-modal');
    const propsToSync = [aria, backdrop, disableBackdropClick, disableCloseButton, dismissButton, fullscreen, heading, open, theme || hooks.useTheme()];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['aria', 'backdrop', 'disableBackdropClick', 'disableCloseButton', 'dismissButton', 'fullscreen', 'heading', 'open', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: hooks.useMergedClass(elementRef, className),
        ref: utils.syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsxRuntime.jsx(WebComponentTag, { ...props });
});

exports.PModal = PModal;
