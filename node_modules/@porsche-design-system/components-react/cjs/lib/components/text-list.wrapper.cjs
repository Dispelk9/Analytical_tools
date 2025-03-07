"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');

const PTextList = /*#__PURE__*/ react.forwardRef(({ listType, orderType, theme, type = 'unordered', className, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-text-list');
    const propsToSync = [listType, orderType, theme || hooks.useTheme(), type];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['listType', 'orderType', 'theme', 'type'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: hooks.useMergedClass(elementRef, className),
        ref: utils.syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsxRuntime.jsx(WebComponentTag, { ...props });
});

exports.PTextList = PTextList;
