"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var optgroup = require('../dsr-components/optgroup.cjs');

const POptgroup = /*#__PURE__*/ react.forwardRef(({ disabled = false, label, className, children, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-optgroup');
    const propsToSync = [disabled, label];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['disabled', 'label'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsxRuntime.jsx(optgroup.DSROptgroup, { disabled, label, children })),
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

exports.POptgroup = POptgroup;
