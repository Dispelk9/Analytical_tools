"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');

/** @deprecated since v3.0.0, will be removed with next major release. Use `p-link` with corresponding social icon instead. */
const PLinkSocial = /*#__PURE__*/ react.forwardRef(({ compact = false, hideLabel = false, href, icon, iconSource, rel, target = '_self', theme, className, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-link-social');
    const propsToSync = [compact, hideLabel, href, icon, iconSource, rel, target, theme || hooks.useTheme()];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['compact', 'hideLabel', 'href', 'icon', 'iconSource', 'rel', 'target', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: hooks.useMergedClass(elementRef, className),
        ref: utils.syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsxRuntime.jsx(WebComponentTag, { ...props });
});

exports.PLinkSocial = PLinkSocial;
