import type { BaseProps } from '../../BaseProps';
import type { DisplayAlign, DisplayColor, BreakpointCustomizable, DisplaySize, DisplayTag, Theme } from '../types';
export type PDisplayProps = BaseProps & {
    /**
     * Text alignment of the component.
     */
    align?: DisplayAlign;
    /**
     * Basic text color variations depending on theme property.
     */
    color?: DisplayColor;
    /**
     * Adds an ellipsis to a single line of text if it overflows.
     */
    ellipsis?: boolean;
    /**
     * Size of the component. Also defines the size for specific breakpoints, like {base: "medium", l: "large"}. You always need to provide a base value when doing this.
     */
    size?: BreakpointCustomizable<DisplaySize>;
    /**
     * Sets a heading tag, so it fits correctly within the outline of the page.
     */
    tag?: DisplayTag;
    /**
     * Adapts the text color depending on the theme. Has no effect when "inherit" is set as color prop.
     */
    theme?: Theme;
};
export declare const PDisplay: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Text alignment of the component.
     */
    align?: DisplayAlign;
    /**
     * Basic text color variations depending on theme property.
     */
    color?: DisplayColor;
    /**
     * Adds an ellipsis to a single line of text if it overflows.
     */
    ellipsis?: boolean;
    /**
     * Size of the component. Also defines the size for specific breakpoints, like {base: "medium", l: "large"}. You always need to provide a base value when doing this.
     */
    size?: BreakpointCustomizable<DisplaySize>;
    /**
     * Sets a heading tag, so it fits correctly within the outline of the page.
     */
    tag?: DisplayTag;
    /**
     * Adapts the text color depending on the theme. Has no effect when "inherit" is set as color prop.
     */
    theme?: Theme;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
