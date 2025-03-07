import type { BaseProps } from '../../BaseProps';
import type { AccordionHeadingTag, AccordionUpdateEventDetail, BreakpointCustomizable, AccordionSize, AccordionTag, Theme } from '../types';
export type PAccordionProps = BaseProps & {
    /**
     * Displays the Accordion as compact version with thinner border and smaller paddings.
     */
    compact?: boolean;
    /**
     * Defines the heading used in accordion.
     */
    heading?: string;
    /**
     * Sets a heading tag, so it fits correctly within the outline of the page.
     */
    headingTag?: AccordionHeadingTag;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `update` event instead. Emitted when accordion state is changed.
     */
    onAccordionChange?: (event: CustomEvent<AccordionUpdateEventDetail>) => void;
    /**
     * Emitted when accordion state is changed.
     */
    onUpdate?: (event: CustomEvent<AccordionUpdateEventDetail>) => void;
    /**
     * Defines if accordion is open.
     */
    open?: boolean;
    /**
     * The text size.
     */
    size?: BreakpointCustomizable<AccordionSize>;
    /**
     * @experimental Sticks the Accordion heading at the top, fixed while scrolling
     */
    sticky?: boolean;
    /**
     * @deprecated , will be removed with next major release, use `heading-tag` instead. Sets a heading tag, so it fits correctly within the outline of the page.
     */
    tag?: AccordionTag;
    /**
     * Adapts the color when used on dark background.
     */
    theme?: Theme;
};
export declare const PAccordion: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Displays the Accordion as compact version with thinner border and smaller paddings.
     */
    compact?: boolean;
    /**
     * Defines the heading used in accordion.
     */
    heading?: string;
    /**
     * Sets a heading tag, so it fits correctly within the outline of the page.
     */
    headingTag?: AccordionHeadingTag;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `update` event instead. Emitted when accordion state is changed.
     */
    onAccordionChange?: (event: CustomEvent<AccordionUpdateEventDetail>) => void;
    /**
     * Emitted when accordion state is changed.
     */
    onUpdate?: (event: CustomEvent<AccordionUpdateEventDetail>) => void;
    /**
     * Defines if accordion is open.
     */
    open?: boolean;
    /**
     * The text size.
     */
    size?: BreakpointCustomizable<AccordionSize>;
    /**
     * @experimental Sticks the Accordion heading at the top, fixed while scrolling
     */
    sticky?: boolean;
    /**
     * @deprecated , will be removed with next major release, use `heading-tag` instead. Sets a heading tag, so it fits correctly within the outline of the page.
     */
    tag?: AccordionTag;
    /**
     * Adapts the color when used on dark background.
     */
    theme?: Theme;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
