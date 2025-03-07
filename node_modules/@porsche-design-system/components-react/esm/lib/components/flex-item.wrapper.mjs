"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';

/** @deprecated since v3.0.0, will be removed with next major release. Use native CSS Flex instead. */
const PFlexItem = /*#__PURE__*/ forwardRef(({ alignSelf = 'auto', flex = 'initial', grow = 0, offset = 'none', shrink = 1, width = 'auto', className, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-flex-item');
    const propsToSync = [alignSelf, flex, grow, offset, shrink, width];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['alignSelf', 'flex', 'grow', 'offset', 'shrink', 'width'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: useMergedClass(elementRef, className),
        ref: syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsx(WebComponentTag, { ...props });
});

export { PFlexItem };
