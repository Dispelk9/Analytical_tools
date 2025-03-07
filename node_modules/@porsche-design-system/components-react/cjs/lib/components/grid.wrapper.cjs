"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');

/** @deprecated since v3.0.0, will be removed with next major release. Use native CSS Grid instead. */
const PGrid = /*#__PURE__*/ react.forwardRef(({ direction = 'row', gutter = { base: 16, s: 24, m: 36 }, wrap = 'wrap', className, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-grid');
    const propsToSync = [direction, gutter, wrap];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['direction', 'gutter', 'wrap'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: hooks.useMergedClass(elementRef, className),
        ref: utils.syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsxRuntime.jsx(WebComponentTag, { ...props });
});

exports.PGrid = PGrid;
