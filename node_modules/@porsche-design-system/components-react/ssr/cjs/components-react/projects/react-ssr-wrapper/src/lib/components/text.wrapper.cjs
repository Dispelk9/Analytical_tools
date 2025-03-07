"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var text = require('../dsr-components/text.cjs');

const PText = /*#__PURE__*/ react.forwardRef(({ align = 'start', color = 'primary', ellipsis = false, size = 'small', tag = 'p', theme, weight = 'regular', className, children, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-text');
    const propsToSync = [align, color, ellipsis, size, tag, theme || hooks.useTheme(), weight];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['align', 'color', 'ellipsis', 'size', 'tag', 'theme', 'weight'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsxRuntime.jsx(text.DSRText, { align, color, ellipsis, size, tag, theme: theme || hooks.useTheme(), weight, children })),
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

exports.PText = PText;
