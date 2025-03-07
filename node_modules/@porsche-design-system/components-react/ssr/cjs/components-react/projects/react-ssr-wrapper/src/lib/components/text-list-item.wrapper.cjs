"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var textListItem = require('../dsr-components/text-list-item.cjs');

const PTextListItem = /*#__PURE__*/ react.forwardRef(({ className, children, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-text-list-item');
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                ...{ "role": "listitem" },
                children: (jsxRuntime.jsx(textListItem.DSRTextListItem, { children })),
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

exports.PTextListItem = PTextListItem;
