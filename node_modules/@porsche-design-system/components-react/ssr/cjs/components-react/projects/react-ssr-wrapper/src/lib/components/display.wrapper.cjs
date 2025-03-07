"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var display = require('../dsr-components/display.cjs');

const PDisplay = /*#__PURE__*/ react.forwardRef(({ align = 'start', color = 'primary', ellipsis = false, size = 'large', tag, theme, className, children, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-display');
    const propsToSync = [align, color, ellipsis, size, tag, theme || hooks.useTheme()];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['align', 'color', 'ellipsis', 'size', 'tag', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsxRuntime.jsx(display.DSRDisplay, { align, color, ellipsis, size, tag, theme: theme || hooks.useTheme(), children })),
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

exports.PDisplay = PDisplay;
