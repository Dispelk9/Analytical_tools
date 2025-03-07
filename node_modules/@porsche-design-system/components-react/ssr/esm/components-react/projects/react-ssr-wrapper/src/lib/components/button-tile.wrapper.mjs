"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';
import { DSRButtonTile } from '../dsr-components/button-tile.mjs';

const PButtonTile = /*#__PURE__*/ forwardRef(({ align = 'bottom', aria, aspectRatio = '4/3', background = 'dark', compact = false, description, disabled = false, gradient = true, icon = 'none', iconSource, label, loading = false, size = 'medium', type = 'submit', weight = 'semi-bold', className, children, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-button-tile');
    const propsToSync = [align, aria, aspectRatio, background, compact, description, disabled, gradient, icon, iconSource, label, loading, size, type, weight];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['align', 'aria', 'aspectRatio', 'background', 'compact', 'description', 'disabled', 'gradient', 'icon', 'iconSource', 'label', 'loading', 'size', 'type', 'weight'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsx(DSRButtonTile, { align, aria, aspectRatio, background, compact, description, disabled, gradient, icon, iconSource, label, loading, size, type, weight, children })),
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

export { PButtonTile };
