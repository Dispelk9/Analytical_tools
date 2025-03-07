"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var accordion = require('../dsr-components/accordion.cjs');

const PAccordion = /*#__PURE__*/ react.forwardRef(({ compact, heading, headingTag = 'h2', onAccordionChange, onUpdate, open, size = 'small', sticky, tag, theme, className, children, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    hooks.useEventCallback(elementRef, 'accordionChange', onAccordionChange);
    hooks.useEventCallback(elementRef, 'update', onUpdate);
    const WebComponentTag = hooks.usePrefix('p-accordion');
    const propsToSync = [compact, heading, headingTag, open, size, sticky, tag, theme || hooks.useTheme()];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['compact', 'heading', 'headingTag', 'open', 'size', 'sticky', 'tag', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsxRuntime.jsx(accordion.DSRAccordion, { compact, heading, headingTag, open, size, sticky, tag, theme: theme || hooks.useTheme(), children })),
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

exports.PAccordion = PAccordion;
