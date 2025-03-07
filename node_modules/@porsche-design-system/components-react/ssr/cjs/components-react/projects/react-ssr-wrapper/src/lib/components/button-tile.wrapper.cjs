"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var buttonTile = require('../dsr-components/button-tile.cjs');

const PButtonTile = /*#__PURE__*/ react.forwardRef(({ align = 'bottom', aria, aspectRatio = '4/3', background = 'dark', compact = false, description, disabled = false, gradient = true, icon = 'none', iconSource, label, loading = false, size = 'medium', type = 'submit', weight = 'semi-bold', className, children, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-button-tile');
    const propsToSync = [align, aria, aspectRatio, background, compact, description, disabled, gradient, icon, iconSource, label, loading, size, type, weight];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['align', 'aria', 'aspectRatio', 'background', 'compact', 'description', 'disabled', 'gradient', 'icon', 'iconSource', 'label', 'loading', 'size', 'type', 'weight'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsxRuntime.jsx(buttonTile.DSRButtonTile, { align, aria, aspectRatio, background, compact, description, disabled, gradient, icon, iconSource, label, loading, size, type, weight, children })),
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

exports.PButtonTile = PButtonTile;
