import type { MutableRefObject } from 'react';
import { useEffect } from 'react';
import type { Theme, ToastMessage } from './lib/types';
/**
 * sets a flag that skips the need for `PorscheDesignSystemProvider` during testing
 * when `process.env.NODE_ENV === 'test'`
 */
export declare const skipCheckForPorscheDesignSystemProviderDuringTests: () => void;
export declare const usePrefix: (tagName: string) => string;
export declare const useTheme: () => Theme;
export declare const useEventCallback: (ref: MutableRefObject<HTMLElement | undefined>, eventName: string, eventHandler: (e: Event) => void) => void;
export declare const useMergedClass: (ref: MutableRefObject<HTMLElement | undefined>, className?: string) => string | undefined;
export declare const useBrowserLayoutEffect: typeof useEffect;
export declare const useToastManager: () => {
    addMessage: (msg: ToastMessage) => void;
};
