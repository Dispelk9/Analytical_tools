import type { BaseProps } from '../../BaseProps';
import type { HeadingAlign, HeadingColor, BreakpointCustomizable, HeadingSize, HeadingTag, Theme } from '../types';
export type PHeadingProps = BaseProps & {
    /**
     * Text alignment of the component.
     */
    align?: HeadingAlign;
    /**
     * Basic text color variations depending on theme property.
     */
    color?: HeadingColor;
    /**
     * Adds an ellipsis to a single line of text if it overflows.
     */
    ellipsis?: boolean;
    /**
     * Size of the component. Also defines the size for specific breakpoints, like {base: "small", l: "medium"}. You always need to provide a base value when doing this.
     */
    size?: BreakpointCustomizable<HeadingSize>;
    /**
     * Sets a heading tag, so it fits correctly within the outline of the page.
     */
    tag?: HeadingTag;
    /**
     * Adapts the text color depending on the theme. Has no effect when "inherit" is set as color prop.
     */
    theme?: Theme;
};
export declare const PHeading: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Text alignment of the component.
     */
    align?: HeadingAlign;
    /**
     * Basic text color variations depending on theme property.
     */
    color?: HeadingColor;
    /**
     * Adds an ellipsis to a single line of text if it overflows.
     */
    ellipsis?: boolean;
    /**
     * Size of the component. Also defines the size for specific breakpoints, like {base: "small", l: "medium"}. You always need to provide a base value when doing this.
     */
    size?: BreakpointCustomizable<HeadingSize>;
    /**
     * Sets a heading tag, so it fits correctly within the outline of the page.
     */
    tag?: HeadingTag;
    /**
     * Adapts the text color depending on the theme. Has no effect when "inherit" is set as color prop.
     */
    theme?: Theme;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
