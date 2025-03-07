"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');

const PBanner = /*#__PURE__*/ react.forwardRef(({ description = '', dismissButton = true, heading = '', headingTag = 'h5', onDismiss, open = false, persistent, state = 'info', theme, width, className, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    hooks.useEventCallback(elementRef, 'dismiss', onDismiss);
    const WebComponentTag = hooks.usePrefix('p-banner');
    const propsToSync = [description, dismissButton, heading, headingTag, open, persistent, state, theme || hooks.useTheme(), width];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['description', 'dismissButton', 'heading', 'headingTag', 'open', 'persistent', 'state', 'theme', 'width'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: hooks.useMergedClass(elementRef, className),
        ref: utils.syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsxRuntime.jsx(WebComponentTag, { ...props });
});

exports.PBanner = PBanner;
