"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var canvas = require('../dsr-components/canvas.cjs');

const PCanvas = /*#__PURE__*/ react.forwardRef(({ onSidebarEndDismiss, onSidebarStartUpdate, sidebarEndOpen = false, sidebarStartOpen = false, theme, className, children, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    hooks.useEventCallback(elementRef, 'sidebarEndDismiss', onSidebarEndDismiss);
    hooks.useEventCallback(elementRef, 'sidebarStartUpdate', onSidebarStartUpdate);
    const WebComponentTag = hooks.usePrefix('p-canvas');
    const propsToSync = [sidebarEndOpen, sidebarStartOpen, theme || hooks.useTheme()];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['sidebarEndOpen', 'sidebarStartOpen', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsxRuntime.jsx(canvas.DSRCanvas, { sidebarEndOpen, sidebarStartOpen, theme: theme || hooks.useTheme(), children })),
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

exports.PCanvas = PCanvas;
