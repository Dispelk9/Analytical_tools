"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var icon = require('../dsr-components/icon.cjs');

const PIcon = /*#__PURE__*/ react.forwardRef(({ aria, color = 'primary', lazy, name = 'arrow-right', size = 'small', source, theme, className, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-icon');
    const propsToSync = [aria, color, lazy, name, size, source, theme || hooks.useTheme()];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['aria', 'color', 'lazy', 'name', 'size', 'source', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsxRuntime.jsx(icon.DSRIcon, { aria, color, lazy, name, size, source, theme: theme || hooks.useTheme() })),
            }
            : {
                suppressHydrationWarning: true,
            }),
        'data-ssr': '',
        class: hooks.useMergedClass(elementRef, className),
        ref: utils.syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsxRuntime.jsx(WebComponentTag, { ...props });
});

exports.PIcon = PIcon;
