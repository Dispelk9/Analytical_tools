"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';
import { DSRTextListItem } from '../dsr-components/text-list-item.mjs';

const PTextListItem = /*#__PURE__*/ forwardRef(({ className, children, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-text-list-item');
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                ...{ "role": "listitem" },
                children: (jsx(DSRTextListItem, { children })),
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

export { PTextListItem };
