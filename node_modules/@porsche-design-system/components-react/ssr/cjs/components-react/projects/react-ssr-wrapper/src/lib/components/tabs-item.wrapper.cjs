"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var tabsItem = require('../dsr-components/tabs-item.cjs');

const PTabsItem = /*#__PURE__*/ react.forwardRef((
// @ts-ignore
{ label, className, children, theme = 'light', ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-tabs-item');
    hooks.useBrowserLayoutEffect(() => {
        elementRef.current.label = label;
    }, [label]);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsxRuntime.jsx(tabsItem.DSRTabsItem, { label, theme, children })),
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

exports.PTabsItem = PTabsItem;
