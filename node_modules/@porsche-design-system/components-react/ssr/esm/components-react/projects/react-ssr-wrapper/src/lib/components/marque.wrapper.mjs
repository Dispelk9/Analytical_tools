"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';
import { DSRMarque } from '../dsr-components/marque.mjs';

/** @deprecated since v3.0.0, will be removed with next major release. Please use "p-wordmark" instead. */
const PMarque = /*#__PURE__*/ forwardRef(({ aria, href, size = 'responsive', target = '_self', trademark = true, variant = 'default', className, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-marque');
    const propsToSync = [aria, href, size, target, trademark, variant];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['aria', 'href', 'size', 'target', 'trademark', 'variant'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsx(DSRMarque, { aria, href, size, target, trademark, variant })),
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

export { PMarque };
