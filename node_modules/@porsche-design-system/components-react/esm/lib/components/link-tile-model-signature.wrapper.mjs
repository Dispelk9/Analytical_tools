"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';

const PLinkTileModelSignature = /*#__PURE__*/ forwardRef(({ aspectRatio = '3/4', description, heading, headingTag = 'h2', linkDirection = { base: 'column', xs: 'row', }, model = '911', weight = 'semi-bold', className, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-link-tile-model-signature');
    const propsToSync = [aspectRatio, description, heading, headingTag, linkDirection, model, weight];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['aspectRatio', 'description', 'heading', 'headingTag', 'linkDirection', 'model', 'weight'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: useMergedClass(elementRef, className),
        ref: syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsx(WebComponentTag, { ...props });
});

export { PLinkTileModelSignature };
