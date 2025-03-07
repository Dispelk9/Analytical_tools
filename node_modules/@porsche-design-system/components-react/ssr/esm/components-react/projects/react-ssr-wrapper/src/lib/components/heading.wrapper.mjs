"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';
import { DSRHeading } from '../dsr-components/heading.mjs';

const PHeading = /*#__PURE__*/ forwardRef(({ align = 'start', color = 'primary', ellipsis = false, size = 'xx-large', tag, theme, className, children, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-heading');
    const propsToSync = [align, color, ellipsis, size, tag, theme || useTheme()];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['align', 'color', 'ellipsis', 'size', 'tag', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsx(DSRHeading, { align, color, ellipsis, size, tag, theme: theme || useTheme(), children })),
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

export { PHeading };
