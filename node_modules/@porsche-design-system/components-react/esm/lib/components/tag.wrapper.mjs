"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';

const PTag = /*#__PURE__*/ forwardRef(({ color = 'background-surface', compact = false, icon, iconSource, theme, className, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-tag');
    const propsToSync = [color, compact, icon, iconSource, theme || useTheme()];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['color', 'compact', 'icon', 'iconSource', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: useMergedClass(elementRef, className),
        ref: syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsx(WebComponentTag, { ...props });
});

export { PTag };
