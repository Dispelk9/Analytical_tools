"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');

const PButtonPure = /*#__PURE__*/ react.forwardRef(({ active = false, alignLabel = 'end', aria, disabled = false, form, hideLabel = false, icon = 'arrow-right', iconSource, loading = false, name, size = 'small', stretch = false, theme, type = 'submit', underline = false, value, weight = 'regular', className, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-button-pure');
    const propsToSync = [active, alignLabel, aria, disabled, form, hideLabel, icon, iconSource, loading, name, size, stretch, theme || hooks.useTheme(), type, underline, value, weight];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['active', 'alignLabel', 'aria', 'disabled', 'form', 'hideLabel', 'icon', 'iconSource', 'loading', 'name', 'size', 'stretch', 'theme', 'type', 'underline', 'value', 'weight'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: hooks.useMergedClass(elementRef, className),
        ref: utils.syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsxRuntime.jsx(WebComponentTag, { ...props });
});

exports.PButtonPure = PButtonPure;
