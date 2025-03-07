import type { BaseProps } from '../../BaseProps';
import type { SelectedAriaAttributes, PopoverAriaAttribute, PopoverDirection, Theme } from '../types';
export type PPopoverProps = BaseProps & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<PopoverAriaAttribute>;
    /**
     * Descriptive text to show additional information when popover is open
     */
    description?: string;
    /**
     * Preferred direction in which popover should open, given there is enough space in viewport. Otherwise, it will be opened in the direction with most available space.
     */
    direction?: PopoverDirection;
    /**
     * Adapts the popover color depending on the theme.
     */
    theme?: Theme;
};
export declare const PPopover: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<PopoverAriaAttribute>;
    /**
     * Descriptive text to show additional information when popover is open
     */
    description?: string;
    /**
     * Preferred direction in which popover should open, given there is enough space in viewport. Otherwise, it will be opened in the direction with most available space.
     */
    direction?: PopoverDirection;
    /**
     * Adapts the popover color depending on the theme.
     */
    theme?: Theme;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
