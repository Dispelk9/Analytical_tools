"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';
import { DSRContentWrapper } from '../dsr-components/content-wrapper.mjs';

/** @deprecated since v3.0.0, will be removed with next major release. Use native CSS Grid instead. */
const PContentWrapper = /*#__PURE__*/ forwardRef(({ backgroundColor = 'transparent', theme, width = 'extended', className, children, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-content-wrapper');
    const propsToSync = [backgroundColor, theme || useTheme(), width];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['backgroundColor', 'theme', 'width'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                children: (jsx(DSRContentWrapper, { backgroundColor, theme: theme || useTheme(), width, children })),
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

export { PContentWrapper };
