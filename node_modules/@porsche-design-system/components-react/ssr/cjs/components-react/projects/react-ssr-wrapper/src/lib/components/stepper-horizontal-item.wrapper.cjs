"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var stepperHorizontalItem = require('../dsr-components/stepper-horizontal-item.cjs');

const PStepperHorizontalItem = /*#__PURE__*/ react.forwardRef((
// @ts-ignore
{ disabled = false, state, className, children, theme = 'light', ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-stepper-horizontal-item');
    const propsToSync = [disabled, state];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['disabled', 'state'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                ...{ "role": "listitem" },
                children: (jsxRuntime.jsx(stepperHorizontalItem.DSRStepperHorizontalItem, { disabled, state, theme, children })),
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

exports.PStepperHorizontalItem = PStepperHorizontalItem;
