"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';

/** @deprecated since v3.0.0, will be removed with next major release. Use native CSS Grid instead. */
const PGrid = /*#__PURE__*/ forwardRef(({ direction = 'row', gutter = { base: 16, s: 24, m: 36 }, wrap = 'wrap', className, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-grid');
    const propsToSync = [direction, gutter, wrap];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['direction', 'gutter', 'wrap'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: useMergedClass(elementRef, className),
        ref: syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsx(WebComponentTag, { ...props });
});

export { PGrid };
