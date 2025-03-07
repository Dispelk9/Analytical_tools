import type { BaseProps } from '../../BaseProps';
import type { SelectedAriaAttributes, SegmentedControlItemAriaAttribute, SegmentedControlItemIcon } from '../types';
export type PSegmentedControlItemProps = BaseProps & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<SegmentedControlItemAriaAttribute>;
    /**
     * Disables the button. No events will be triggered while disabled state is active.
     */
    disabled?: boolean;
    /**
     * The icon shown.
     */
    icon?: SegmentedControlItemIcon;
    /**
     * A URL path to a custom icon.
     */
    iconSource?: string;
    /**
     * The label text.
     */
    label?: string;
    /**
     * The value of this item which is emitted by the parent element if it becomes selected. This property is **required**.
     */
    value: string | number;
};
export declare const PSegmentedControlItem: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<SegmentedControlItemAriaAttribute>;
    /**
     * Disables the button. No events will be triggered while disabled state is active.
     */
    disabled?: boolean;
    /**
     * The icon shown.
     */
    icon?: SegmentedControlItemIcon;
    /**
     * A URL path to a custom icon.
     */
    iconSource?: string;
    /**
     * The label text.
     */
    label?: string;
    /**
     * The value of this item which is emitted by the parent element if it becomes selected. This property is **required**.
     */
    value: string | number;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
