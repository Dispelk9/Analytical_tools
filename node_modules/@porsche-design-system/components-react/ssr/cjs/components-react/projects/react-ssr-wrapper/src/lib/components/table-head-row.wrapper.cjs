"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var tableHeadRow = require('../dsr-components/table-head-row.cjs');

const PTableHeadRow = /*#__PURE__*/ react.forwardRef(({ className, children, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-table-head-row');
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                ...{ "role": "row" },
                children: (jsxRuntime.jsx(tableHeadRow.DSRTableHeadRow, { children })),
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

exports.PTableHeadRow = PTableHeadRow;
