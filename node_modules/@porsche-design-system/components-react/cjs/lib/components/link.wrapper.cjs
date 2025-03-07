"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');

const PLink = /*#__PURE__*/ react.forwardRef(({ aria, compact = false, download, hideLabel = false, href, icon = 'none', iconSource, rel, target = '_self', theme, variant = 'primary', className, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-link');
    const propsToSync = [aria, compact, download, hideLabel, href, icon, iconSource, rel, target, theme || hooks.useTheme(), variant];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['aria', 'compact', 'download', 'hideLabel', 'href', 'icon', 'iconSource', 'rel', 'target', 'theme', 'variant'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: hooks.useMergedClass(elementRef, className),
        ref: utils.syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsxRuntime.jsx(WebComponentTag, { ...props });
});

exports.PLink = PLink;
