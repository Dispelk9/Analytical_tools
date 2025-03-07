"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { useEventCallback, usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';
import { DSRInlineNotification } from '../dsr-components/inline-notification.mjs';

const PInlineNotification = /*#__PURE__*/ forwardRef(({ actionIcon = 'arrow-right', actionLabel, actionLoading = false, description = '', dismissButton = true, heading = '', headingTag = 'h5', onAction, onDismiss, persistent, state = 'info', theme, className, children, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    useEventCallback(elementRef, 'action', onAction);
    useEventCallback(elementRef, 'dismiss', onDismiss);
    const WebComponentTag = usePrefix('p-inline-notification');
    const propsToSync = [actionIcon, actionLabel, actionLoading, description, dismissButton, heading, headingTag, persistent, state, theme || useTheme()];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['actionIcon', 'actionLabel', 'actionLoading', 'description', 'dismissButton', 'heading', 'headingTag', 'persistent', 'state', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsx(DSRInlineNotification, { actionIcon, actionLabel, actionLoading, description, dismissButton, heading, headingTag, persistent, state, theme: theme || useTheme(), children })),
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

export { PInlineNotification };
