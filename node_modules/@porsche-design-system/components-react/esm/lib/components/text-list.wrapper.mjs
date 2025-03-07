"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';

const PTextList = /*#__PURE__*/ forwardRef(({ listType, orderType, theme, type = 'unordered', className, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-text-list');
    const propsToSync = [listType, orderType, theme || useTheme(), type];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['listType', 'orderType', 'theme', 'type'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: useMergedClass(elementRef, className),
        ref: syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsx(WebComponentTag, { ...props });
});

export { PTextList };
