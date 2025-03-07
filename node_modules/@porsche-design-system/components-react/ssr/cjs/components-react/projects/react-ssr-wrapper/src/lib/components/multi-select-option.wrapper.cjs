"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var multiSelectOption = require('../dsr-components/multi-select-option.cjs');

const PMultiSelectOption = /*#__PURE__*/ react.forwardRef(({ disabled = false, value, className, children, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-multi-select-option');
    const propsToSync = [disabled, value];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['disabled', 'value'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsxRuntime.jsx(multiSelectOption.DSRMultiSelectOption, { disabled, value, children })),
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

exports.PMultiSelectOption = PMultiSelectOption;
