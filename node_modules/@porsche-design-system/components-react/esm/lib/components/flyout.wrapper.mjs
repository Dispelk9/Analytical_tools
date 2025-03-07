"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { useEventCallback, usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';

const PFlyout = /*#__PURE__*/ forwardRef(({ aria, disableBackdropClick = false, footerBehavior = 'sticky', onDismiss, onMotionHiddenEnd, onMotionVisibleEnd, open = false, position = 'end', theme, className, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    useEventCallback(elementRef, 'dismiss', onDismiss);
    useEventCallback(elementRef, 'motionHiddenEnd', onMotionHiddenEnd);
    useEventCallback(elementRef, 'motionVisibleEnd', onMotionVisibleEnd);
    const WebComponentTag = usePrefix('p-flyout');
    const propsToSync = [aria, disableBackdropClick, footerBehavior, open, position, theme || useTheme()];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['aria', 'disableBackdropClick', 'footerBehavior', 'open', 'position', 'theme'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: useMergedClass(elementRef, className),
        ref: syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsx(WebComponentTag, { ...props });
});

export { PFlyout };
