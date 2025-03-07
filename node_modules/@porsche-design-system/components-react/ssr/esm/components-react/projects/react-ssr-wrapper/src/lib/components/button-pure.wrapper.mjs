"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';
import { DSRButtonPure } from '../dsr-components/button-pure.mjs';

const PButtonPure = /*#__PURE__*/ forwardRef(({ active = false, alignLabel = 'end', aria, disabled = false, form, hideLabel = false, icon = 'arrow-right', iconSource, loading = false, name, size = 'small', stretch = false, theme, type = 'submit', underline = false, value, weight = 'regular', className, children, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-button-pure');
    const propsToSync = [active, alignLabel, aria, disabled, form, hideLabel, icon, iconSource, loading, name, size, stretch, theme || useTheme(), type, underline, value, weight];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['active', 'alignLabel', 'aria', 'disabled', 'form', 'hideLabel', 'icon', 'iconSource', 'loading', 'name', 'size', 'stretch', 'theme', 'type', 'underline', 'value', 'weight'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsx(DSRButtonPure, { active, alignLabel, aria, disabled, form, hideLabel, icon, iconSource, loading, name, size, stretch, theme: theme || useTheme(), type, underline, value, weight, children })),
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

export { PButtonPure };
