"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var pinCode = require('../dsr-components/pin-code.cjs');

const PPinCode = /*#__PURE__*/ react.forwardRef(({ description = '', disabled = false, form, hideLabel = false, label = '', length = 4, loading = false, message = '', name, onUpdate, required = false, state = 'none', theme, type = 'number', value = '', className, children, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    hooks.useEventCallback(elementRef, 'update', onUpdate);
    const WebComponentTag = hooks.usePrefix('p-pin-code');
    const propsToSync = [description, disabled, form, hideLabel, label, length, loading, message, name, required, state, theme || hooks.useTheme(), type, value];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['description', 'disabled', 'form', 'hideLabel', 'label', 'length', 'loading', 'message', 'name', 'required', 'state', 'theme', 'type', 'value'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsxRuntime.jsx(pinCode.DSRPinCode, { description, disabled, form, hideLabel, label, length, loading, message, name, required, state, theme: theme || hooks.useTheme(), type, value, children })),
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

exports.PPinCode = PPinCode;
