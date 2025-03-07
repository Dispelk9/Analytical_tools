"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { useEventCallback, usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';
import { DSRPinCode } from '../dsr-components/pin-code.mjs';

const PPinCode = /*#__PURE__*/ forwardRef(({ description = '', disabled = false, form, hideLabel = false, label = '', length = 4, loading = false, message = '', name, onUpdate, required = false, state = 'none', theme, type = 'number', value = '', className, children, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    useEventCallback(elementRef, 'update', onUpdate);
    const WebComponentTag = usePrefix('p-pin-code');
    const propsToSync = [description, disabled, form, hideLabel, label, length, loading, message, name, required, state, theme || useTheme(), type, value];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['description', 'disabled', 'form', 'hideLabel', 'label', 'length', 'loading', 'message', 'name', 'required', 'state', 'theme', 'type', 'value'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsx(DSRPinCode, { description, disabled, form, hideLabel, label, length, loading, message, name, required, state, theme: theme || useTheme(), type, value, children })),
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

export { PPinCode };
