"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';
import { DSRTableBody } from '../dsr-components/table-body.mjs';

const PTableBody = /*#__PURE__*/ forwardRef(({ className, children, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-table-body');
    const props = {
        ...rest,
        // @ts-ignore
        ...(!process.browser
            ? {
                ...{ "role": "rowgroup" },
                children: (jsx(DSRTableBody, { children })),
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

export { PTableBody };
