"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { useEventCallback, usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';
import { DSRBanner } from '../dsr-components/banner.mjs';

const PBanner = /*#__PURE__*/ forwardRef(({ description = '', dismissButton = true, heading = '', headingTag = 'h5', onDismiss, open = false, persistent, state = 'info', theme, width, className, children, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    useEventCallback(elementRef, 'dismiss', onDismiss);
    const WebComponentTag = usePrefix('p-banner');
    const propsToSync = [description, dismissButton, heading, headingTag, open, persistent, state, theme || useTheme(), width];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['description', 'dismissButton', 'heading', 'headingTag', 'open', 'persistent', 'state', 'theme', 'width'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                ...{ "popover": "manual" },
                children: (jsx(DSRBanner, { description, dismissButton, heading, headingTag, open, persistent, state, theme: theme || useTheme(), width, children })),
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

export { PBanner };
