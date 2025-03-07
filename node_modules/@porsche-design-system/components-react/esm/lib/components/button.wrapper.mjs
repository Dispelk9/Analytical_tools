"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';

const PButton = /*#__PURE__*/ forwardRef(({ aria, compact = false, disabled = false, form, hideLabel = false, icon = 'none', iconSource, loading = false, name, theme, type = 'submit', value, variant = 'primary', className, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-button');
    const propsToSync = [aria, compact, disabled, form, hideLabel, icon, iconSource, loading, name, theme || useTheme(), type, value, variant];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['aria', 'compact', 'disabled', 'form', 'hideLabel', 'icon', 'iconSource', 'loading', 'name', 'theme', 'type', 'value', 'variant'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: useMergedClass(elementRef, className),
        ref: syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsx(WebComponentTag, { ...props });
});

export { PButton };
