"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var segmentedControl = require('../dsr-components/segmented-control.cjs');

const PSegmentedControl = /*#__PURE__*/ react.forwardRef(({ backgroundColor, columns = 'auto', disabled = false, form, name, onSegmentedControlChange, onUpdate, theme, value, className, children, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    hooks.useEventCallback(elementRef, 'segmentedControlChange', onSegmentedControlChange);
    hooks.useEventCallback(elementRef, 'update', onUpdate);
    const WebComponentTag = hooks.usePrefix('p-segmented-control');
    const propsToSync = [backgroundColor, columns, disabled, form, name, theme || hooks.useTheme(), value];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['backgroundColor', 'columns', 'disabled', 'form', 'name', 'theme', 'value'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                ...{ "role": "group" },
                children: (jsxRuntime.jsx(segmentedControl.DSRSegmentedControl, { backgroundColor, columns, disabled, form, name, theme: theme || hooks.useTheme(), value, children })),
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

exports.PSegmentedControl = PSegmentedControl;
