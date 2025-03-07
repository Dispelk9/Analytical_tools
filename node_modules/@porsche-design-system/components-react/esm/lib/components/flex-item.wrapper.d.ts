import type { BaseProps } from '../../BaseProps';
import type { BreakpointCustomizable, FlexItemAlignSelf, FlexItemFlex, FlexItemGrow, FlexItemOffset, FlexItemShrink, FlexItemWidth } from '../types';
export type PFlexItemProps = BaseProps & {
    /**
     * Defines how this flex item is aligned along the cross axis. This overwrites the cross axis alignment set by the container. Corresponds to the "alignSelf" css property.
     */
    alignSelf?: BreakpointCustomizable<FlexItemAlignSelf>;
    /**
     * The shorthand property for the combined definition of "shrink", "grow" and "basis"
     */
    flex?: BreakpointCustomizable<FlexItemFlex>;
    /**
     * The ability to allow/disallow the flex child to grow.
     */
    grow?: BreakpointCustomizable<FlexItemGrow>;
    /**
     * The offset of the column. You can also supply values for specific breakpoints, like {base: "none", l: "one-quarter"}. You always need to provide a base value when doing this.
     */
    offset?: BreakpointCustomizable<FlexItemOffset>;
    /**
     * The ability to allow/disallow the flex child to shrink.
     */
    shrink?: BreakpointCustomizable<FlexItemShrink>;
    /**
     * The width of the flex item. You can also supply values for specific breakpoints, like {base: "full", l: "one-quarter"}. You always need to provide a base value when doing this.
     */
    width?: BreakpointCustomizable<FlexItemWidth>;
};
/** @deprecated since v3.0.0, will be removed with next major release. Use native CSS Flex instead. */
export declare const PFlexItem: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Defines how this flex item is aligned along the cross axis. This overwrites the cross axis alignment set by the container. Corresponds to the "alignSelf" css property.
     */
    alignSelf?: BreakpointCustomizable<FlexItemAlignSelf>;
    /**
     * The shorthand property for the combined definition of "shrink", "grow" and "basis"
     */
    flex?: BreakpointCustomizable<FlexItemFlex>;
    /**
     * The ability to allow/disallow the flex child to grow.
     */
    grow?: BreakpointCustomizable<FlexItemGrow>;
    /**
     * The offset of the column. You can also supply values for specific breakpoints, like {base: "none", l: "one-quarter"}. You always need to provide a base value when doing this.
     */
    offset?: BreakpointCustomizable<FlexItemOffset>;
    /**
     * The ability to allow/disallow the flex child to shrink.
     */
    shrink?: BreakpointCustomizable<FlexItemShrink>;
    /**
     * The width of the flex item. You can also supply values for specific breakpoints, like {base: "full", l: "one-quarter"}. You always need to provide a base value when doing this.
     */
    width?: BreakpointCustomizable<FlexItemWidth>;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
