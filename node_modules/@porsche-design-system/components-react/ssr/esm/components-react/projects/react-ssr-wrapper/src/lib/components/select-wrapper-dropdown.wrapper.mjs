"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { useEventCallback, usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';
import { DSRSelectWrapperDropdown } from '../dsr-components/select-wrapper-dropdown.mjs';

const PSelectWrapperDropdown = /*#__PURE__*/ forwardRef(({ description, direction = 'auto', disabled = false, filter = false, isOpenOverride = false, label, message, onOpenChange, required = false, selectRef, state, theme, className, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    useEventCallback(elementRef, 'openChange', onOpenChange);
    const WebComponentTag = usePrefix('p-select-wrapper-dropdown');
    const propsToSync = [description, direction, disabled, filter, isOpenOverride, label, message, required, selectRef, state, theme || useTheme()];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['description', 'direction', 'disabled', 'filter', 'isOpenOverride', 'label', 'message', 'required', 'selectRef', 'state', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsx(DSRSelectWrapperDropdown, { description, direction, disabled, filter, isOpenOverride, label, message, required, selectRef, state, theme: theme || useTheme() })),
            }
            : {
                suppressHydrationWarning: true,
            }),
        'data-ssr': '',
        class: useMergedClass(elementRef, className),
        ref: syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsx(WebComponentTag, { ...props });
});

export { PSelectWrapperDropdown };
