"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');

/** @deprecated since v3.0.0, will be removed with next major release. Please use "p-wordmark" instead. */
const PMarque = /*#__PURE__*/ react.forwardRef(({ aria, href, size = 'responsive', target = '_self', trademark = true, variant = 'default', className, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-marque');
    const propsToSync = [aria, href, size, target, trademark, variant];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['aria', 'href', 'size', 'target', 'trademark', 'variant'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: hooks.useMergedClass(elementRef, className),
        ref: utils.syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsxRuntime.jsx(WebComponentTag, { ...props });
});

exports.PMarque = PMarque;
