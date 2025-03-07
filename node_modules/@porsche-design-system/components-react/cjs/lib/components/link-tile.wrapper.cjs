"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');

const PLinkTile = /*#__PURE__*/ react.forwardRef(({ align = 'bottom', aria, aspectRatio = '4/3', background = 'dark', compact = false, description, download, gradient = true, href, label, rel, size = 'medium', target = '_self', weight = 'semi-bold', className, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-link-tile');
    const propsToSync = [align, aria, aspectRatio, background, compact, description, download, gradient, href, label, rel, size, target, weight];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['align', 'aria', 'aspectRatio', 'background', 'compact', 'description', 'download', 'gradient', 'href', 'label', 'rel', 'size', 'target', 'weight'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: hooks.useMergedClass(elementRef, className),
        ref: utils.syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsxRuntime.jsx(WebComponentTag, { ...props });
});

exports.PLinkTile = PLinkTile;
