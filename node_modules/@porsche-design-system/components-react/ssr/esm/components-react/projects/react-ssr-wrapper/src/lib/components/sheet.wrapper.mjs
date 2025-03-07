"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { useEventCallback, usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';
import { DSRSheet } from '../dsr-components/sheet.mjs';

const PSheet = /*#__PURE__*/ forwardRef(({ aria, disableBackdropClick = false, dismissButton = true, onDismiss, onMotionHiddenEnd, onMotionVisibleEnd, open = false, theme, className, children, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    useEventCallback(elementRef, 'dismiss', onDismiss);
    useEventCallback(elementRef, 'motionHiddenEnd', onMotionHiddenEnd);
    useEventCallback(elementRef, 'motionVisibleEnd', onMotionVisibleEnd);
    const WebComponentTag = usePrefix('p-sheet');
    const propsToSync = [aria, disableBackdropClick, dismissButton, open, theme || useTheme()];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['aria', 'disableBackdropClick', 'dismissButton', 'open', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsx(DSRSheet, { aria, disableBackdropClick, dismissButton, open, theme: theme || useTheme(), children })),
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

export { PSheet };
