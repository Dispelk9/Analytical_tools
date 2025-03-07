import type { BaseProps } from '../../BaseProps';
import type { Theme } from '../types';
export type PToastProps = BaseProps & {
    /**
     * Adapts the toast color depending on the theme.
     */
    theme?: Theme;
};
export declare const PToast: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Adapts the toast color depending on the theme.
     */
    theme?: Theme;
} & import("react").RefAttributes<HTMLElement>>;
