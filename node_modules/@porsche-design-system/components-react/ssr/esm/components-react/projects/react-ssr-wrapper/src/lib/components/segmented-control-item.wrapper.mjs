"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';
import { DSRSegmentedControlItem } from '../dsr-components/segmented-control-item.mjs';

const PSegmentedControlItem = /*#__PURE__*/ forwardRef((
// @ts-ignore
{ aria, disabled = false, icon, iconSource, label, value, className, children, selected, theme = 'light', ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-segmented-control-item');
    const propsToSync = [aria, disabled, icon, iconSource, label, value];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['aria', 'disabled', 'icon', 'iconSource', 'label', 'value'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsx(DSRSegmentedControlItem, { aria, disabled, icon, iconSource, label, value, selected, theme, children })),
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

export { PSegmentedControlItem };
