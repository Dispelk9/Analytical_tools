"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { useEventCallback, usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';

const PLinkTileProduct = /*#__PURE__*/ forwardRef(({ aspectRatio = '3:4', description, heading, href, likeButton = true, liked = false, onLike, price, priceOriginal, rel, target = '_self', theme, className, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    useEventCallback(elementRef, 'like', onLike);
    const WebComponentTag = usePrefix('p-link-tile-product');
    const propsToSync = [aspectRatio, description, heading, href, likeButton, liked, price, priceOriginal, rel, target, theme || useTheme()];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['aspectRatio', 'description', 'heading', 'href', 'likeButton', 'liked', 'price', 'priceOriginal', 'rel', 'target', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: useMergedClass(elementRef, className),
        ref: syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsx(WebComponentTag, { ...props });
});

export { PLinkTileProduct };
