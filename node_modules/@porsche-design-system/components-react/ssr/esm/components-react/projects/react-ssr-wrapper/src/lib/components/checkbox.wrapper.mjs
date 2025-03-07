"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { useEventCallback, usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';
import { DSRCheckbox } from '../dsr-components/checkbox.mjs';

const PCheckbox = /*#__PURE__*/ forwardRef(({ checked = false, compact = false, disabled = false, form, hideLabel = false, indeterminate = false, label = '', loading = false, message = '', name = '', onBlur, onUpdate, required = false, state = 'none', theme, value = 'on', className, children, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    useEventCallback(elementRef, 'blur', onBlur);
    useEventCallback(elementRef, 'update', onUpdate);
    const WebComponentTag = usePrefix('p-checkbox');
    const propsToSync = [checked, compact, disabled, form, hideLabel, indeterminate, label, loading, message, name, required, state, theme || useTheme(), value];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['checked', 'compact', 'disabled', 'form', 'hideLabel', 'indeterminate', 'label', 'loading', 'message', 'name', 'required', 'state', 'theme', 'value'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsx(DSRCheckbox, { checked, compact, disabled, form, hideLabel, indeterminate, label, loading, message, name, required, state, theme: theme || useTheme(), value, children })),
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

export { PCheckbox };
