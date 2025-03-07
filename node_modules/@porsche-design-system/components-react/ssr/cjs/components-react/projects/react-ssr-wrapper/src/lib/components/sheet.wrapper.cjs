"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var sheet = require('../dsr-components/sheet.cjs');

const PSheet = /*#__PURE__*/ react.forwardRef(({ aria, disableBackdropClick = false, dismissButton = true, onDismiss, onMotionHiddenEnd, onMotionVisibleEnd, open = false, theme, className, children, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    hooks.useEventCallback(elementRef, 'dismiss', onDismiss);
    hooks.useEventCallback(elementRef, 'motionHiddenEnd', onMotionHiddenEnd);
    hooks.useEventCallback(elementRef, 'motionVisibleEnd', onMotionVisibleEnd);
    const WebComponentTag = hooks.usePrefix('p-sheet');
    const propsToSync = [aria, disableBackdropClick, dismissButton, open, theme || hooks.useTheme()];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['aria', 'disableBackdropClick', 'dismissButton', 'open', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsxRuntime.jsx(sheet.DSRSheet, { aria, disableBackdropClick, dismissButton, open, theme: theme || hooks.useTheme(), children })),
            }
            : {
                children,
                suppressHydrationWarning: true,
            }),
        'data-ssr': '',
        class: hooks.useMergedClass(elementRef, className),
        ref: utils.syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsxRuntime.jsx(WebComponentTag, { ...props });
});

exports.PSheet = PSheet;
