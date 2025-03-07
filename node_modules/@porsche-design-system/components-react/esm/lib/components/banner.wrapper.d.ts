import type { BaseProps } from '../../BaseProps';
import type { BannerHeadingTag, BannerState, Theme, BannerWidth } from '../types';
export type PBannerProps = BaseProps & {
    /**
     * Description of the banner.
     */
    description?: string;
    /**
     * If false, the banner will not have a dismiss button.
     */
    dismissButton?: boolean;
    /**
     * Heading of the banner.
     */
    heading?: string;
    /**
     * Sets a heading tag, so it fits correctly within the outline of the page.
     */
    headingTag?: BannerHeadingTag;
    /**
     * Emitted when the close button is clicked.
     */
    onDismiss?: (event: CustomEvent<void>) => void;
    /**
     * If true, the banner is open.
     */
    open: boolean;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `dismissButton` instead. Defines if the banner can be closed/removed by the user.
     */
    persistent?: boolean;
    /**
     * State of the banner.
     */
    state?: BannerState;
    /**
     * Adapts the banner color depending on the theme.
     */
    theme?: Theme;
    /**
     * Has no effect anymore
     * @deprecated since v3.0.0, will be removed with next major release
     */
    width?: BannerWidth;
};
export declare const PBanner: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Description of the banner.
     */
    description?: string;
    /**
     * If false, the banner will not have a dismiss button.
     */
    dismissButton?: boolean;
    /**
     * Heading of the banner.
     */
    heading?: string;
    /**
     * Sets a heading tag, so it fits correctly within the outline of the page.
     */
    headingTag?: BannerHeadingTag;
    /**
     * Emitted when the close button is clicked.
     */
    onDismiss?: (event: CustomEvent<void>) => void;
    /**
     * If true, the banner is open.
     */
    open: boolean;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `dismissButton` instead. Defines if the banner can be closed/removed by the user.
     */
    persistent?: boolean;
    /**
     * State of the banner.
     */
    state?: BannerState;
    /**
     * Adapts the banner color depending on the theme.
     */
    theme?: Theme;
    /**
     * Has no effect anymore
     * @deprecated since v3.0.0, will be removed with next major release
     */
    width?: BannerWidth;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
