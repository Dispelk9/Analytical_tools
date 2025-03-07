"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');
var linkTileModelSignature = require('../dsr-components/link-tile-model-signature.cjs');

const PLinkTileModelSignature = /*#__PURE__*/ react.forwardRef(({ aspectRatio = '3/4', description, heading, headingTag = 'h2', linkDirection = { base: 'column', xs: 'row', }, model = '911', weight = 'semi-bold', className, children, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    const WebComponentTag = hooks.usePrefix('p-link-tile-model-signature');
    const propsToSync = [aspectRatio, description, heading, headingTag, linkDirection, model, weight];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['aspectRatio', 'description', 'heading', 'headingTag', 'linkDirection', 'model', 'weight'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsxRuntime.jsx(linkTileModelSignature.DSRLinkTileModelSignature, { aspectRatio, description, heading, headingTag, linkDirection, model, weight, children })),
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

exports.PLinkTileModelSignature = PLinkTileModelSignature;
