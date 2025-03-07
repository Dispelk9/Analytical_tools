import type { BaseProps } from '../../BaseProps';
import type { ContentWrapperBackgroundColor, Theme, ContentWrapperWidth } from '../types';
export type PContentWrapperProps = BaseProps & {
    /**
     * Has no effect anymore
     * @deprecated since v3.0.0, will be removed with next major release
     */
    backgroundColor?: ContentWrapperBackgroundColor;
    /**
     * Has no effect anymore
     * @deprecated since v3.0.0, will be removed with next major release
     */
    theme?: Theme;
    /**
     * Defines the outer spacings between the content area and the left and right screen sides, as well as centering its content and setting a max-width.
     */
    width?: ContentWrapperWidth;
};
/** @deprecated since v3.0.0, will be removed with next major release. Use native CSS Grid instead. */
export declare const PContentWrapper: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Has no effect anymore
     * @deprecated since v3.0.0, will be removed with next major release
     */
    backgroundColor?: ContentWrapperBackgroundColor;
    /**
     * Has no effect anymore
     * @deprecated since v3.0.0, will be removed with next major release
     */
    theme?: Theme;
    /**
     * Defines the outer spacings between the content area and the left and right screen sides, as well as centering its content and setting a max-width.
     */
    width?: ContentWrapperWidth;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
