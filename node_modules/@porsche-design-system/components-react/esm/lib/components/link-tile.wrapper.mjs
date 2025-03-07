"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';

const PLinkTile = /*#__PURE__*/ forwardRef(({ align = 'bottom', aria, aspectRatio = '4/3', background = 'dark', compact = false, description, download, gradient = true, href, label, rel, size = 'medium', target = '_self', weight = 'semi-bold', className, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-link-tile');
    const propsToSync = [align, aria, aspectRatio, background, compact, description, download, gradient, href, label, rel, size, target, weight];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['align', 'aria', 'aspectRatio', 'background', 'compact', 'description', 'download', 'gradient', 'href', 'label', 'rel', 'size', 'target', 'weight'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: useMergedClass(elementRef, className),
        ref: syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsx(WebComponentTag, { ...props });
});

export { PLinkTile };
