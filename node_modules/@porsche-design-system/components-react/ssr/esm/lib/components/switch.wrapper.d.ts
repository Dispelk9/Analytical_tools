import type { BaseProps } from '../../BaseProps';
import type { BreakpointCustomizable, SwitchAlignLabel, SwitchUpdateEventDetail, Theme } from '../types';
export type PSwitchProps = BaseProps & {
    /**
     * Aligns the label.
     */
    alignLabel?: BreakpointCustomizable<SwitchAlignLabel>;
    /**
     * Visualize the switch with on/off status.
     */
    checked?: boolean;
    /**
     * Displays as compact version.
     */
    compact?: boolean;
    /**
     * Disables the switch. No events will be triggered while disabled state is active.
     */
    disabled?: boolean;
    /**
     * Show or hide label. For better accessibility it's recommended to show the label.
     */
    hideLabel?: BreakpointCustomizable<boolean>;
    /**
     * Disables the switch and shows a loading indicator. No events will be triggered while loading state is active.
     */
    loading?: boolean;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `update` event instead. Emitted when checked status is changed.
     */
    onSwitchChange?: (event: CustomEvent<SwitchUpdateEventDetail>) => void;
    /**
     * Emitted when checked status is changed.
     */
    onUpdate?: (event: CustomEvent<SwitchUpdateEventDetail>) => void;
    /**
     * Stretches the contents to max available space.
     */
    stretch?: BreakpointCustomizable<boolean>;
    /**
     * Adapts the switch color depending on the theme.
     */
    theme?: Theme;
};
export declare const PSwitch: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Aligns the label.
     */
    alignLabel?: BreakpointCustomizable<SwitchAlignLabel>;
    /**
     * Visualize the switch with on/off status.
     */
    checked?: boolean;
    /**
     * Displays as compact version.
     */
    compact?: boolean;
    /**
     * Disables the switch. No events will be triggered while disabled state is active.
     */
    disabled?: boolean;
    /**
     * Show or hide label. For better accessibility it's recommended to show the label.
     */
    hideLabel?: BreakpointCustomizable<boolean>;
    /**
     * Disables the switch and shows a loading indicator. No events will be triggered while loading state is active.
     */
    loading?: boolean;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `update` event instead. Emitted when checked status is changed.
     */
    onSwitchChange?: (event: CustomEvent<SwitchUpdateEventDetail>) => void;
    /**
     * Emitted when checked status is changed.
     */
    onUpdate?: (event: CustomEvent<SwitchUpdateEventDetail>) => void;
    /**
     * Stretches the contents to max available space.
     */
    stretch?: BreakpointCustomizable<boolean>;
    /**
     * Adapts the switch color depending on the theme.
     */
    theme?: Theme;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
