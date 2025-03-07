import type { BaseProps } from '../../BaseProps';
import type { TagColor, TagIcon, Theme } from '../types';
export type PTagProps = BaseProps & {
    /**
     * Background color variations depending on theme property.
     */
    color?: TagColor;
    /**
     * Displays as compact version.
     */
    compact?: boolean;
    /**
     * The icon shown.
     */
    icon?: TagIcon;
    /**
     * A URL path to a custom icon.
     */
    iconSource?: string;
    /**
     * Adapts the tag color depending on the theme.
     */
    theme?: Theme;
};
export declare const PTag: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Background color variations depending on theme property.
     */
    color?: TagColor;
    /**
     * Displays as compact version.
     */
    compact?: boolean;
    /**
     * The icon shown.
     */
    icon?: TagIcon;
    /**
     * A URL path to a custom icon.
     */
    iconSource?: string;
    /**
     * Adapts the tag color depending on the theme.
     */
    theme?: Theme;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
