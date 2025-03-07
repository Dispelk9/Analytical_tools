import type { PropsWithChildren, JSX } from 'react';
import type { Theme } from './lib/types';
export declare const PorscheDesignSystemContext: import("react").Context<{
    prefix?: string;
    theme: Theme;
}>;
type Props = {
    prefix?: string;
    cdn?: 'auto' | 'cn';
    theme?: Theme;
};
export declare const PorscheDesignSystemProvider: ({ prefix, cdn, theme, ...props }: PropsWithChildren<Props>) => JSX.Element;
export {};
