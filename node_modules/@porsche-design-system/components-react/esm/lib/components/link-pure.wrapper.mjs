"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';

const PLinkPure = /*#__PURE__*/ forwardRef(({ active = false, alignLabel = 'end', aria, download, hideLabel = false, href, icon = 'arrow-right', iconSource, rel, size = 'small', stretch = false, target = '_self', theme, underline = false, weight = 'regular', className, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-link-pure');
    const propsToSync = [active, alignLabel, aria, download, hideLabel, href, icon, iconSource, rel, size, stretch, target, theme || useTheme(), underline, weight];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['active', 'alignLabel', 'aria', 'download', 'hideLabel', 'href', 'icon', 'iconSource', 'rel', 'size', 'stretch', 'target', 'theme', 'underline', 'weight'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: useMergedClass(elementRef, className),
        ref: syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsx(WebComponentTag, { ...props });
});

export { PLinkPure };
