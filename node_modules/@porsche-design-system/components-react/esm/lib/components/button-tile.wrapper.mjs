"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';

const PButtonTile = /*#__PURE__*/ forwardRef(({ align = 'bottom', aria, aspectRatio = '4/3', background = 'dark', compact = false, description, disabled = false, gradient = true, icon = 'none', iconSource, label, loading = false, size = 'medium', type = 'submit', weight = 'semi-bold', className, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-button-tile');
    const propsToSync = [align, aria, aspectRatio, background, compact, description, disabled, gradient, icon, iconSource, label, loading, size, type, weight];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['align', 'aria', 'aspectRatio', 'background', 'compact', 'description', 'disabled', 'gradient', 'icon', 'iconSource', 'label', 'loading', 'size', 'type', 'weight'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: useMergedClass(elementRef, className),
        ref: syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsx(WebComponentTag, { ...props });
});

export { PButtonTile };
