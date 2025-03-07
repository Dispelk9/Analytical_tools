"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var flex = require('../dsr-components/flex.cjs');

/** @deprecated since v3.0.0, will be removed with next major release. Use native CSS Flex instead. */
const PFlex = /*#__PURE__*/ react.forwardRef(({ alignContent = 'stretch', alignItems = 'stretch', direction = 'row', inline = false, justifyContent = 'flex-start', wrap = 'nowrap', className, children, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-flex');
    const propsToSync = [alignContent, alignItems, direction, inline, justifyContent, wrap];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['alignContent', 'alignItems', 'direction', 'inline', 'justifyContent', 'wrap'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsxRuntime.jsx(flex.DSRFlex, { alignContent, alignItems, direction, inline, justifyContent, wrap, children })),
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

exports.PFlex = PFlex;
