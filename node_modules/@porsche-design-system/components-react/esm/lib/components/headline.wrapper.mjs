"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';

/** @deprecated since v3.0.0, will be removed with next major release. Please use "p-heading" instead. */
const PHeadline = /*#__PURE__*/ forwardRef(({ align = 'start', color = 'primary', ellipsis = false, tag, theme, variant = 'headline-1', className, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-headline');
    const propsToSync = [align, color, ellipsis, tag, theme || useTheme(), variant];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['align', 'color', 'ellipsis', 'tag', 'theme', 'variant'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: useMergedClass(elementRef, className),
        ref: syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsx(WebComponentTag, { ...props });
});

export { PHeadline };
