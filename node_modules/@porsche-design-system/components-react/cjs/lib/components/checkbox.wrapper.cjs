"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');

const PCheckbox = /*#__PURE__*/ react.forwardRef(({ checked = false, compact = false, disabled = false, form, hideLabel = false, indeterminate = false, label = '', loading = false, message = '', name = '', onBlur, onUpdate, required = false, state = 'none', theme, value = 'on', className, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    hooks.useEventCallback(elementRef, 'blur', onBlur);
    hooks.useEventCallback(elementRef, 'update', onUpdate);
    const WebComponentTag = hooks.usePrefix('p-checkbox');
    const propsToSync = [checked, compact, disabled, form, hideLabel, indeterminate, label, loading, message, name, required, state, theme || hooks.useTheme(), value];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['checked', 'compact', 'disabled', 'form', 'hideLabel', 'indeterminate', 'label', 'loading', 'message', 'name', 'required', 'state', 'theme', 'value'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: hooks.useMergedClass(elementRef, className),
        ref: utils.syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsxRuntime.jsx(WebComponentTag, { ...props });
});

exports.PCheckbox = PCheckbox;
