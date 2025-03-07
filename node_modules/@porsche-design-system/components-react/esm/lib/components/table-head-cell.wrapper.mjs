"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';

const PTableHeadCell = /*#__PURE__*/ forwardRef(({ hideLabel = false, multiline = false, sort, className, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-table-head-cell');
    const propsToSync = [hideLabel, multiline, sort];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['hideLabel', 'multiline', 'sort'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: useMergedClass(elementRef, className),
        ref: syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsx(WebComponentTag, { ...props });
});

export { PTableHeadCell };
