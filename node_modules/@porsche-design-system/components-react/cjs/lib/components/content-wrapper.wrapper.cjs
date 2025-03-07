"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');

/** @deprecated since v3.0.0, will be removed with next major release. Use native CSS Grid instead. */
const PContentWrapper = /*#__PURE__*/ react.forwardRef(({ backgroundColor = 'transparent', theme, width = 'extended', className, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-content-wrapper');
    const propsToSync = [backgroundColor, theme || hooks.useTheme(), width];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['backgroundColor', 'theme', 'width'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: hooks.useMergedClass(elementRef, className),
        ref: utils.syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsxRuntime.jsx(WebComponentTag, { ...props });
});

exports.PContentWrapper = PContentWrapper;
