"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';

const PDivider = /*#__PURE__*/ forwardRef(({ color = 'contrast-low', direction = 'horizontal', orientation, theme, className, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-divider');
    const propsToSync = [color, direction, orientation, theme || useTheme()];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['color', 'direction', 'orientation', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: useMergedClass(elementRef, className),
        ref: syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsx(WebComponentTag, { ...props });
});

export { PDivider };
