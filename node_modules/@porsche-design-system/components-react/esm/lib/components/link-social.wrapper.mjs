"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';

/** @deprecated since v3.0.0, will be removed with next major release. Use `p-link` with corresponding social icon instead. */
const PLinkSocial = /*#__PURE__*/ forwardRef(({ compact = false, hideLabel = false, href, icon, iconSource, rel, target = '_self', theme, className, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    const WebComponentTag = usePrefix('p-link-social');
    const propsToSync = [compact, hideLabel, href, icon, iconSource, rel, target, theme || useTheme()];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['compact', 'hideLabel', 'href', 'icon', 'iconSource', 'rel', 'target', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: useMergedClass(elementRef, className),
        ref: syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsx(WebComponentTag, { ...props });
});

export { PLinkSocial };
