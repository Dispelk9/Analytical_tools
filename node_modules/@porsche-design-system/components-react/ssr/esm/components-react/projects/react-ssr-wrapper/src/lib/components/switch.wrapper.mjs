"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { useEventCallback, usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';
import { DSRSwitch } from '../dsr-components/switch.mjs';

const PSwitch = /*#__PURE__*/ forwardRef(({ alignLabel = 'end', checked = false, compact = false, disabled = false, hideLabel = false, loading = false, onSwitchChange, onUpdate, stretch = false, theme, className, children, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    useEventCallback(elementRef, 'switchChange', onSwitchChange);
    useEventCallback(elementRef, 'update', onUpdate);
    const WebComponentTag = usePrefix('p-switch');
    const propsToSync = [alignLabel, checked, compact, disabled, hideLabel, loading, stretch, theme || useTheme()];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['alignLabel', 'checked', 'compact', 'disabled', 'hideLabel', 'loading', 'stretch', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsx(DSRSwitch, { alignLabel, checked, compact, disabled, hideLabel, loading, stretch, theme: theme || useTheme(), children })),
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

export { PSwitch };
