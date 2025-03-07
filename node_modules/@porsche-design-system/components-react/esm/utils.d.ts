import type { ForwardedRef, MutableRefObject } from 'react';
export declare const getMergedClassName: (domClassName: string, oldClassName?: string, newClassName?: string) => string;
export declare const syncRef: (elementRef: MutableRefObject<HTMLElement | undefined>, ref: ForwardedRef<HTMLElement>) => (el: HTMLElement) => void;
export declare const skipPorscheDesignSystemCDNRequestsDuringTests: () => void;
