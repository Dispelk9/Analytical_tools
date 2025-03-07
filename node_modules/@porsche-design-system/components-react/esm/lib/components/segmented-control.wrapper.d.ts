import type { BaseProps } from '../../BaseProps';
import type { SegmentedControlBackgroundColor, BreakpointCustomizable, SegmentedControlColumns, SegmentedControlUpdateEventDetail, Theme } from '../types';
export type PSegmentedControlProps = BaseProps & {
    /**
     * @deprecated since v3.0.0, will be removed with next major release. Background color variations
     */
    backgroundColor?: SegmentedControlBackgroundColor;
    /**
     * Sets the amount of columns.
     */
    columns?: BreakpointCustomizable<SegmentedControlColumns>;
    /**
     * Disables the segmented-control.
     */
    disabled?: boolean;
    /**
     * The id of a form element the segmented-control should be associated with.
     */
    form?: string;
    /**
     * The name of the segmented-control.
     */
    name?: string;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `update` event instead. Emitted when selected element changes.
     */
    onSegmentedControlChange?: (event: CustomEvent<SegmentedControlUpdateEventDetail>) => void;
    /**
     * Emitted when selected element changes.
     */
    onUpdate?: (event: CustomEvent<SegmentedControlUpdateEventDetail>) => void;
    /**
     * Adapts the segmented-control color depending on the theme.
     */
    theme?: Theme;
    /**
     * Sets the initial value of the segmented-control.
     */
    value?: string | number;
};
export declare const PSegmentedControl: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * @deprecated since v3.0.0, will be removed with next major release. Background color variations
     */
    backgroundColor?: SegmentedControlBackgroundColor;
    /**
     * Sets the amount of columns.
     */
    columns?: BreakpointCustomizable<SegmentedControlColumns>;
    /**
     * Disables the segmented-control.
     */
    disabled?: boolean;
    /**
     * The id of a form element the segmented-control should be associated with.
     */
    form?: string;
    /**
     * The name of the segmented-control.
     */
    name?: string;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `update` event instead. Emitted when selected element changes.
     */
    onSegmentedControlChange?: (event: CustomEvent<SegmentedControlUpdateEventDetail>) => void;
    /**
     * Emitted when selected element changes.
     */
    onUpdate?: (event: CustomEvent<SegmentedControlUpdateEventDetail>) => void;
    /**
     * Adapts the segmented-control color depending on the theme.
     */
    theme?: Theme;
    /**
     * Sets the initial value of the segmented-control.
     */
    value?: string | number;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
