import type { BaseProps } from '../../BaseProps';
import type { HeadlineAlign, HeadlineColor, HeadlineTag, Theme, HeadlineVariant } from '../types';
export type PHeadlineProps = BaseProps & {
    /**
     * Text alignment of the component.
     */
    align?: HeadlineAlign;
    /**
     * Basic text color variations depending on theme property.
     */
    color?: HeadlineColor;
    /**
     * Adds an ellipsis to a single line of text if it overflows.
     */
    ellipsis?: boolean;
    /**
     * Sets a custom HTML tag depending on the usage of the headline component.
     */
    tag?: HeadlineTag;
    /**
     * Adapts the text color depending on the theme. Has no effect when "inherit" is set as color prop.
     */
    theme?: Theme;
    /**
     * Predefined style of the headline.
     */
    variant?: HeadlineVariant;
};
/** @deprecated since v3.0.0, will be removed with next major release. Please use "p-heading" instead. */
export declare const PHeadline: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Text alignment of the component.
     */
    align?: HeadlineAlign;
    /**
     * Basic text color variations depending on theme property.
     */
    color?: HeadlineColor;
    /**
     * Adds an ellipsis to a single line of text if it overflows.
     */
    ellipsis?: boolean;
    /**
     * Sets a custom HTML tag depending on the usage of the headline component.
     */
    tag?: HeadlineTag;
    /**
     * Adapts the text color depending on the theme. Has no effect when "inherit" is set as color prop.
     */
    theme?: Theme;
    /**
     * Predefined style of the headline.
     */
    variant?: HeadlineVariant;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
