"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var flyout = require('../dsr-components/flyout.cjs');

const PFlyout = /*#__PURE__*/ react.forwardRef(({ aria, disableBackdropClick = false, footerBehavior = 'sticky', onDismiss, onMotionHiddenEnd, onMotionVisibleEnd, open = false, position = 'end', theme, className, children, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    hooks.useEventCallback(elementRef, 'dismiss', onDismiss);
    hooks.useEventCallback(elementRef, 'motionHiddenEnd', onMotionHiddenEnd);
    hooks.useEventCallback(elementRef, 'motionVisibleEnd', onMotionVisibleEnd);
    const WebComponentTag = hooks.usePrefix('p-flyout');
    const propsToSync = [aria, disableBackdropClick, footerBehavior, open, position, theme || hooks.useTheme()];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['aria', 'disableBackdropClick', 'footerBehavior', 'open', 'position', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsxRuntime.jsx(flyout.DSRFlyout, { aria, disableBackdropClick, footerBehavior, open, position, theme: theme || hooks.useTheme(), children })),
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

exports.PFlyout = PFlyout;
