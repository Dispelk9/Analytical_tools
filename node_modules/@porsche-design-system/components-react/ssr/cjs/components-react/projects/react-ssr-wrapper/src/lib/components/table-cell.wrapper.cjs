"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var tableCell = require('../dsr-components/table-cell.cjs');

const PTableCell = /*#__PURE__*/ react.forwardRef(({ multiline = false, className, children, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-table-cell');
    hooks.useBrowserLayoutEffect(() => {
        elementRef.current.multiline = multiline;
    }, [multiline]);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                ...{ "role": "cell" },
                children: (jsxRuntime.jsx(tableCell.DSRTableCell, { multiline, children })),
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

exports.PTableCell = PTableCell;
