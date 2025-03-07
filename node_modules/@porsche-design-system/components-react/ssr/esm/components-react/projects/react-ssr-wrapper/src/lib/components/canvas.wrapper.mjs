"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { useEventCallback, usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';
import { DSRCanvas } from '../dsr-components/canvas.mjs';

const PCanvas = /*#__PURE__*/ forwardRef(({ onSidebarEndDismiss, onSidebarStartUpdate, sidebarEndOpen = false, sidebarStartOpen = false, theme, className, children, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    useEventCallback(elementRef, 'sidebarEndDismiss', onSidebarEndDismiss);
    useEventCallback(elementRef, 'sidebarStartUpdate', onSidebarStartUpdate);
    const WebComponentTag = usePrefix('p-canvas');
    const propsToSync = [sidebarEndOpen, sidebarStartOpen, theme || useTheme()];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['sidebarEndOpen', 'sidebarStartOpen', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsx(DSRCanvas, { sidebarEndOpen, sidebarStartOpen, theme: theme || useTheme(), children })),
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

export { PCanvas };
