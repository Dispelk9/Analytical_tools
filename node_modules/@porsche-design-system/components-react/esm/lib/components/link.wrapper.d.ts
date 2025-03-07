import type { BaseProps } from '../../BaseProps';
import type { SelectedAriaAttributes, LinkAriaAttribute, BreakpointCustomizable, LinkIcon, LinkTarget, Theme, LinkVariant } from '../types';
export type PLinkProps = BaseProps & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<LinkAriaAttribute>;
    /**
     * Displays as compact version.
     */
    compact?: BreakpointCustomizable<boolean>;
    /**
     * Special download attribute to open native browser download dialog if target url points to a downloadable file.
     */
    download?: string;
    /**
     * Show or hide label. For better accessibility it is recommended to show the label.
     */
    hideLabel?: BreakpointCustomizable<boolean>;
    /**
     * When providing an url then the component will be rendered as `<a>`.
     */
    href?: string;
    /**
     * The icon shown. By choosing 'none', no icon is displayed.
     */
    icon?: LinkIcon;
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
    target?: LinkTarget;
    /**
     * Adapts the link color when used on dark background.
     */
    theme?: Theme;
    /**
     * The style variant of the link.
     */
    variant?: LinkVariant;
};
export declare const PLink: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<LinkAriaAttribute>;
    /**
     * Displays as compact version.
     */
    compact?: BreakpointCustomizable<boolean>;
    /**
     * Special download attribute to open native browser download dialog if target url points to a downloadable file.
     */
    download?: string;
    /**
     * Show or hide label. For better accessibility it is recommended to show the label.
     */
    hideLabel?: BreakpointCustomizable<boolean>;
    /**
     * When providing an url then the component will be rendered as `<a>`.
     */
    href?: string;
    /**
     * The icon shown. By choosing 'none', no icon is displayed.
     */
    icon?: LinkIcon;
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
    target?: LinkTarget;
    /**
     * Adapts the link color when used on dark background.
     */
    theme?: Theme;
    /**
     * The style variant of the link.
     */
    variant?: LinkVariant;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
