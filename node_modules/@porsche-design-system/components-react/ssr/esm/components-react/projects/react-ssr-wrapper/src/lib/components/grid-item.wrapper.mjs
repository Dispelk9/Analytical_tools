"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';
import { DSRGridItem } from '../dsr-components/grid-item.mjs';

/** @deprecated since v3.0.0, will be removed with next major release. Use native CSS Grid instead. */
const PGridItem = /*#__PURE__*/ forwardRef(({ offset = 0, size = 1, className, children, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-grid-item');
    const propsToSync = [offset, size];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['offset', 'size'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsx(DSRGridItem, { offset, size, children })),
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

export { PGridItem };
