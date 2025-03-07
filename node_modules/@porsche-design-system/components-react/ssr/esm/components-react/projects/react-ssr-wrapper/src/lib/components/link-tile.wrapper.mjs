"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';
import { DSRLinkTile } from '../dsr-components/link-tile.mjs';

const PLinkTile = /*#__PURE__*/ forwardRef(({ align = 'bottom', aria, aspectRatio = '4/3', background = 'dark', compact = false, description, download, gradient = true, href, label, rel, size = 'medium', target = '_self', weight = 'semi-bold', className, children, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-link-tile');
    const propsToSync = [align, aria, aspectRatio, background, compact, description, download, gradient, href, label, rel, size, target, weight];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['align', 'aria', 'aspectRatio', 'background', 'compact', 'description', 'download', 'gradient', 'href', 'label', 'rel', 'size', 'target', 'weight'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsx(DSRLinkTile, { align, aria, aspectRatio, background, compact, description, download, gradient, href, label, rel, size, target, weight, children })),
            }
            : {
                children,
                suppressHydrationWarning: true,
            }),
        'data-ssr': '',
        class: useMergedClass(elementRef, className),
        ref: syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsx(WebComponentTag, { ...props });
});

export { PLinkTile };
