"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');

const PLinkTileProduct = /*#__PURE__*/ react.forwardRef(({ aspectRatio = '3:4', description, heading, href, likeButton = true, liked = false, onLike, price, priceOriginal, rel, target = '_self', theme, className, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    hooks.useEventCallback(elementRef, 'like', onLike);
    const WebComponentTag = hooks.usePrefix('p-link-tile-product');
    const propsToSync = [aspectRatio, description, heading, href, likeButton, liked, price, priceOriginal, rel, target, theme || hooks.useTheme()];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['aspectRatio', 'description', 'heading', 'href', 'likeButton', 'liked', 'price', 'priceOriginal', 'rel', 'target', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: hooks.useMergedClass(elementRef, className),
        ref: utils.syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsxRuntime.jsx(WebComponentTag, { ...props });
});

exports.PLinkTileProduct = PLinkTileProduct;
