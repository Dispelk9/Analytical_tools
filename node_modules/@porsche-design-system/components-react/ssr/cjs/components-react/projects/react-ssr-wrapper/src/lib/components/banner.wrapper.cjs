"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var banner = require('../dsr-components/banner.cjs');

const PBanner = /*#__PURE__*/ react.forwardRef(({ description = '', dismissButton = true, heading = '', headingTag = 'h5', onDismiss, open = false, persistent, state = 'info', theme, width, className, children, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    hooks.useEventCallback(elementRef, 'dismiss', onDismiss);
    const WebComponentTag = hooks.usePrefix('p-banner');
    const propsToSync = [description, dismissButton, heading, headingTag, open, persistent, state, theme || hooks.useTheme(), width];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['description', 'dismissButton', 'heading', 'headingTag', 'open', 'persistent', 'state', 'theme', 'width'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                ...{ "popover": "manual" },
                children: (jsxRuntime.jsx(banner.DSRBanner, { description, dismissButton, heading, headingTag, open, persistent, state, theme: theme || hooks.useTheme(), width, children })),
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

exports.PBanner = PBanner;
