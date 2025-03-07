"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { useEventCallback, usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';

const PCanvas = /*#__PURE__*/ forwardRef(({ onSidebarEndDismiss, onSidebarStartUpdate, sidebarEndOpen = false, sidebarStartOpen = false, theme, className, ...rest }, ref) => {
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
        class: useMergedClass(elementRef, className),
        ref: syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsx(WebComponentTag, { ...props });
});

export { PCanvas };
