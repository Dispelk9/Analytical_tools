declare global {
    interface Window {
        /** @deprecated since v3 */
        PORSCHE_DESIGN_SYSTEM_CDN: 'auto' | 'cn';
    }
    interface Document {
        porscheDesignSystem: {
            [key: `${number}.${number}.${number}${`-rc.${number}` | ''}`]: {
                prefixes: string[];
                isReady: () => Promise<void>;
                readyResolve: () => void;
            };
            cdn: {
                url: string;
                prefixes: string[];
            };
        };
    }
}
/**
 * @property prefix - the prefix used for the components
 * @property cdn - the cdn to load assets from
 */
export type LoadOptions = {
    prefix?: string;
    cdn?: 'auto' | 'cn';
};
export declare const load: (opts?: LoadOptions) => void;


export declare const componentsReady: (el?: HTMLElement, readyState?: DocumentReadyState) => Promise<number>;
