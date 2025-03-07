"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');

const PModelSignature = /*#__PURE__*/ react.forwardRef(({ color = 'primary', fetchPriority = 'auto', lazy = false, model = '911', safeZone = true, size = 'small', theme, className, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-model-signature');
    const propsToSync = [color, fetchPriority, lazy, model, safeZone, size, theme || hooks.useTheme()];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['color', 'fetchPriority', 'lazy', 'model', 'safeZone', 'size', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: hooks.useMergedClass(elementRef, className),
        ref: utils.syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsxRuntime.jsx(WebComponentTag, { ...props });
});

exports.PModelSignature = PModelSignature;
