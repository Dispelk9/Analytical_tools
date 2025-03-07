import type { BaseProps } from '../../BaseProps';
import type { TextAlign, TextColor, BreakpointCustomizable, TextSize, TextTag, Theme, TextWeight } from '../types';
export type PTextProps = BaseProps & {
    /**
     * Text alignment of the component.
     */
    align?: TextAlign;
    /**
     * Basic text color variations depending on theme property.
     */
    color?: TextColor;
    /**
     * Adds an ellipsis to a single line of text if it overflows.
     */
    ellipsis?: boolean;
    /**
     * Size of the text. Also defines the size for specific breakpoints, like {base: "small", l: "medium"}. You always need to provide a base value when doing this.
     */
    size?: BreakpointCustomizable<TextSize>;
    /**
     * Sets a custom HTML tag depending on the usage of the text component.
     */
    tag?: TextTag;
    /**
     * Adapts the text color depending on the theme. Has no effect when "inherit" is set as color prop.
     */
    theme?: Theme;
    /**
     * The weight of the text.
     */
    weight?: TextWeight;
};
export declare const PText: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Text alignment of the component.
     */
    align?: TextAlign;
    /**
     * Basic text color variations depending on theme property.
     */
    color?: TextColor;
    /**
     * Adds an ellipsis to a single line of text if it overflows.
     */
    ellipsis?: boolean;
    /**
     * Size of the text. Also defines the size for specific breakpoints, like {base: "small", l: "medium"}. You always need to provide a base value when doing this.
     */
    size?: BreakpointCustomizable<TextSize>;
    /**
     * Sets a custom HTML tag depending on the usage of the text component.
     */
    tag?: TextTag;
    /**
     * Adapts the text color depending on the theme. Has no effect when "inherit" is set as color prop.
     */
    theme?: Theme;
    /**
     * The weight of the text.
     */
    weight?: TextWeight;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
