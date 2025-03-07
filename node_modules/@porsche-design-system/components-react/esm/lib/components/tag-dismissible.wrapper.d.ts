import type { BaseProps } from '../../BaseProps';
import type { SelectedAriaAttributes, TagDismissibleAriaAttribute, TagDismissibleColor, Theme } from '../types';
export type PTagDismissibleProps = BaseProps & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<TagDismissibleAriaAttribute>;
    /**
     * Background color variations
     */
    color?: TagDismissibleColor;
    /**
     * The label text.
     */
    label?: string;
    /**
     * Adapts the color when used on dark background.
     */
    theme?: Theme;
};
export declare const PTagDismissible: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<TagDismissibleAriaAttribute>;
    /**
     * Background color variations
     */
    color?: TagDismissibleColor;
    /**
     * The label text.
     */
    label?: string;
    /**
     * Adapts the color when used on dark background.
     */
    theme?: Theme;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
