"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var segmentedControlItem = require('../dsr-components/segmented-control-item.cjs');

const PSegmentedControlItem = /*#__PURE__*/ react.forwardRef((
// @ts-ignore
{ aria, disabled = false, icon, iconSource, label, value, className, children, selected, theme = 'light', ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-segmented-control-item');
    const propsToSync = [aria, disabled, icon, iconSource, label, value];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['aria', 'disabled', 'icon', 'iconSource', 'label', 'value'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsxRuntime.jsx(segmentedControlItem.DSRSegmentedControlItem, { aria, disabled, icon, iconSource, label, value, selected, theme, children })),
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

exports.PSegmentedControlItem = PSegmentedControlItem;
