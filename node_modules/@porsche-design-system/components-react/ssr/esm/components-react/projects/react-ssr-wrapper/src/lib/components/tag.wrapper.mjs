"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';
import { DSRTag } from '../dsr-components/tag.mjs';

const PTag = /*#__PURE__*/ forwardRef(({ color = 'background-surface', compact = false, icon, iconSource, theme, className, children, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-tag');
    const propsToSync = [color, compact, icon, iconSource, theme || useTheme()];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['color', 'compact', 'icon', 'iconSource', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsx(DSRTag, { color, compact, icon, iconSource, theme: theme || useTheme(), children })),
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

export { PTag };
