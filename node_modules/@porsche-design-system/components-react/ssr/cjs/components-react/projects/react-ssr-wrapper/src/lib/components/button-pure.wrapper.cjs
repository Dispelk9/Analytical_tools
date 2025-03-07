"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var buttonPure = require('../dsr-components/button-pure.cjs');

const PButtonPure = /*#__PURE__*/ react.forwardRef(({ active = false, alignLabel = 'end', aria, disabled = false, form, hideLabel = false, icon = 'arrow-right', iconSource, loading = false, name, size = 'small', stretch = false, theme, type = 'submit', underline = false, value, weight = 'regular', className, children, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-button-pure');
    const propsToSync = [active, alignLabel, aria, disabled, form, hideLabel, icon, iconSource, loading, name, size, stretch, theme || hooks.useTheme(), type, underline, value, weight];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['active', 'alignLabel', 'aria', 'disabled', 'form', 'hideLabel', 'icon', 'iconSource', 'loading', 'name', 'size', 'stretch', 'theme', 'type', 'underline', 'value', 'weight'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsxRuntime.jsx(buttonPure.DSRButtonPure, { active, alignLabel, aria, disabled, form, hideLabel, icon, iconSource, loading, name, size, stretch, theme: theme || hooks.useTheme(), type, underline, value, weight, children })),
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

exports.PButtonPure = PButtonPure;
