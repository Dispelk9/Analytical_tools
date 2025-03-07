"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';

const PLink = /*#__PURE__*/ forwardRef(({ aria, compact = false, download, hideLabel = false, href, icon = 'none', iconSource, rel, target = '_self', theme, variant = 'primary', className, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-link');
    const propsToSync = [aria, compact, download, hideLabel, href, icon, iconSource, rel, target, theme || useTheme(), variant];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['aria', 'compact', 'download', 'hideLabel', 'href', 'icon', 'iconSource', 'rel', 'target', 'theme', 'variant'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: useMergedClass(elementRef, className),
        ref: syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsx(WebComponentTag, { ...props });
});

export { PLink };
