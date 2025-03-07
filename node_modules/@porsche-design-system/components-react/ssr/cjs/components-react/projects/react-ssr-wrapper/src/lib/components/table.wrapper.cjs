"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var table = require('../dsr-components/table.cjs');

const PTable = /*#__PURE__*/ react.forwardRef(({ caption, compact = false, layout = 'auto', onSortingChange, onUpdate, theme, className, children, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    hooks.useEventCallback(elementRef, 'sortingChange', onSortingChange);
    hooks.useEventCallback(elementRef, 'update', onUpdate);
    const WebComponentTag = hooks.usePrefix('p-table');
    const propsToSync = [caption, compact, layout, theme || hooks.useTheme()];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['caption', 'compact', 'layout', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsxRuntime.jsx(table.DSRTable, { caption, compact, layout, theme: theme || hooks.useTheme(), children })),
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

exports.PTable = PTable;
