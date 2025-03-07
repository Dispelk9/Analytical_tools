"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';

const PSegmentedControlItem = /*#__PURE__*/ forwardRef(({ aria, disabled = false, icon, iconSource, label, value, className, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-segmented-control-item');
    const propsToSync = [aria, disabled, icon, iconSource, label, value];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['aria', 'disabled', 'icon', 'iconSource', 'label', 'value'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: useMergedClass(elementRef, className),
        ref: syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsx(WebComponentTag, { ...props });
});

export { PSegmentedControlItem };
