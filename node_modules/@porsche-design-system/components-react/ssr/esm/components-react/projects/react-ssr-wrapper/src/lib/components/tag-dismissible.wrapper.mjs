"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';
import { DSRTagDismissible } from '../dsr-components/tag-dismissible.mjs';

const PTagDismissible = /*#__PURE__*/ forwardRef(({ aria, color = 'background-surface', label, theme, className, children, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-tag-dismissible');
    const propsToSync = [aria, color, label, theme || useTheme()];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['aria', 'color', 'label', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsx(DSRTagDismissible, { aria, color, label, theme: theme || useTheme(), children })),
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

export { PTagDismissible };
