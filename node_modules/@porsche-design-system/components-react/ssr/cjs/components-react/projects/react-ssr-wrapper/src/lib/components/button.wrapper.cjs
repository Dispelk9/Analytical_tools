"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var button = require('../dsr-components/button.cjs');

const PButton = /*#__PURE__*/ react.forwardRef(({ aria, compact = false, disabled = false, form, hideLabel = false, icon = 'none', iconSource, loading = false, name, theme, type = 'submit', value, variant = 'primary', className, children, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-button');
    const propsToSync = [aria, compact, disabled, form, hideLabel, icon, iconSource, loading, name, theme || hooks.useTheme(), type, value, variant];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['aria', 'compact', 'disabled', 'form', 'hideLabel', 'icon', 'iconSource', 'loading', 'name', 'theme', 'type', 'value', 'variant'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsxRuntime.jsx(button.DSRButton, { aria, compact, disabled, form, hideLabel, icon, iconSource, loading, name, theme: theme || hooks.useTheme(), type, value, variant, children })),
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

exports.PButton = PButton;
