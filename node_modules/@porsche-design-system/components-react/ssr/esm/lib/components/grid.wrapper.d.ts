import type { BaseProps } from '../../BaseProps';
import type { BreakpointCustomizable, GridDirection, GridGutter, GridWrap } from '../types';
export type PGridProps = BaseProps & {
    /**
     * Defines the direction of the main and cross axis. The default "row" defines the main axis as horizontal left to right. Also defines the direction for specific breakpoints, like {base: "column", l: "row"}. You always need to provide a base value when doing this.
     */
    direction?: BreakpointCustomizable<GridDirection>;
    /**
     * Has no effect anymore
     * @deprecated since v3.0.0, will be removed with next major release
     */
    gutter?: BreakpointCustomizable<GridGutter>;
    /**
     * Handles wrapping behaviour of elements.
     */
    wrap?: BreakpointCustomizable<GridWrap>;
};
/** @deprecated since v3.0.0, will be removed with next major release. Use native CSS Grid instead. */
export declare const PGrid: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Defines the direction of the main and cross axis. The default "row" defines the main axis as horizontal left to right. Also defines the direction for specific breakpoints, like {base: "column", l: "row"}. You always need to provide a base value when doing this.
     */
    direction?: BreakpointCustomizable<GridDirection>;
    /**
     * Has no effect anymore
     * @deprecated since v3.0.0, will be removed with next major release
     */
    gutter?: BreakpointCustomizable<GridGutter>;
    /**
     * Handles wrapping behaviour of elements.
     */
    wrap?: BreakpointCustomizable<GridWrap>;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
