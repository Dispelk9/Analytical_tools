import type { BaseProps } from '../../BaseProps';
import type { DividerColor, BreakpointCustomizable, DividerDirection, DividerOrientation, Theme } from '../types';
export type PDividerProps = BaseProps & {
    /**
     * Defines color depending on theme.
     */
    color?: DividerColor;
    /**
     * Defines direction.
     */
    direction?: BreakpointCustomizable<DividerDirection>;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `direction` instead. Defines orientation.
     */
    orientation?: BreakpointCustomizable<DividerOrientation>;
    /**
     * Adapts color depending on theme.
     */
    theme?: Theme;
};
export declare const PDivider: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Defines color depending on theme.
     */
    color?: DividerColor;
    /**
     * Defines direction.
     */
    direction?: BreakpointCustomizable<DividerDirection>;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `direction` instead. Defines orientation.
     */
    orientation?: BreakpointCustomizable<DividerOrientation>;
    /**
     * Adapts color depending on theme.
     */
    theme?: Theme;
} & import("react").RefAttributes<HTMLElement>>;
