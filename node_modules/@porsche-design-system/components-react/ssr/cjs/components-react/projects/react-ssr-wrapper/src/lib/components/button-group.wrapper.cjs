"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var buttonGroup = require('../dsr-components/button-group.cjs');

const PButtonGroup = /*#__PURE__*/ react.forwardRef(({ direction = { base: 'column', xs: 'row' }, className, children, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-button-group');
    hooks.useBrowserLayoutEffect(() => {
        elementRef.current.direction = direction;
    }, [direction]);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsxRuntime.jsx(buttonGroup.DSRButtonGroup, { direction, children })),
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

exports.PButtonGroup = PButtonGroup;
