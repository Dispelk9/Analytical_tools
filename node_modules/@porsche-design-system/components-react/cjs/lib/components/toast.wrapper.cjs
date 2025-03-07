"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');

const PToast = /*#__PURE__*/ react.forwardRef(({ theme, className, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-toast');
    const themeValue = hooks.useTheme();
    hooks.useBrowserLayoutEffect(() => {
        elementRef.current.theme = theme || themeValue;
    }, [theme, themeValue]);
    const props = {
        ...rest,
        class: hooks.useMergedClass(elementRef, className),
        ref: utils.syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsxRuntime.jsx(WebComponentTag, { ...props });
});

exports.PToast = PToast;
