import type { BaseProps } from '../../BaseProps';
import type { BreakpointCustomizable, LinkSocialIcon, LinkSocialTarget, Theme } from '../types';
export type PLinkSocialProps = BaseProps & {
    /**
     * Displays as compact version.
     */
    compact?: boolean;
    /**
     * Show or hide label.
     */
    hideLabel?: BreakpointCustomizable<boolean>;
    /**
     * When providing an url then the component will be rendered as `<a>`.
     */
    href?: string;
    /**
     * The icon shown.
     */
    icon?: LinkSocialIcon;
    /**
     * A URL path to a custom icon.
     */
    iconSource?: string;
    /**
     * Specifies the relationship of the target object to the link object.
     */
    rel?: string;
    /**
     * Target attribute where the link should be opened.
     */
    target?: LinkSocialTarget;
    /**
     * Adapts the link color when used on dark background.
     */
    theme?: Theme;
};
/** @deprecated since v3.0.0, will be removed with next major release. Use `p-link` with corresponding social icon instead. */
export declare const PLinkSocial: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Displays as compact version.
     */
    compact?: boolean;
    /**
     * Show or hide label.
     */
    hideLabel?: BreakpointCustomizable<boolean>;
    /**
     * When providing an url then the component will be rendered as `<a>`.
     */
    href?: string;
    /**
     * The icon shown.
     */
    icon?: LinkSocialIcon;
    /**
     * A URL path to a custom icon.
     */
    iconSource?: string;
    /**
     * Specifies the relationship of the target object to the link object.
     */
    rel?: string;
    /**
     * Target attribute where the link should be opened.
     */
    target?: LinkSocialTarget;
    /**
     * Adapts the link color when used on dark background.
     */
    theme?: Theme;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
