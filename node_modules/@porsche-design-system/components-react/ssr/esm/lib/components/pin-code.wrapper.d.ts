import type { BaseProps } from '../../BaseProps';
import type { BreakpointCustomizable, PinCodeLength, PinCodeUpdateEventDetail, PinCodeState, Theme, PinCodeType } from '../types';
export type PPinCodeProps = BaseProps & {
    /**
     * The description text.
     */
    description?: string;
    /**
     * Disables the Pin Code. No events will be triggered while disabled state is active.
     */
    disabled?: boolean;
    /**
     * The id of a form element the pin-code should be associated with.
     */
    form?: string;
    /**
     * Show or hide label and description text. For better accessibility it is recommended to show the label.
     */
    hideLabel?: BreakpointCustomizable<boolean>;
    /**
     * The label text.
     */
    label?: string;
    /**
     * Number of characters of the Pin Code.
     */
    length?: PinCodeLength;
    /**
     * Disables the Pin Code and shows a loading indicator. No events will be triggered while loading state is active.
     */
    loading?: boolean;
    /**
     * The message styled depending on validation state.
     */
    message?: string;
    /**
     * Name of the control.
     */
    name?: string;
    /**
     * Emitted when selected element changes.
     */
    onUpdate?: (event: CustomEvent<PinCodeUpdateEventDetail>) => void;
    /**
     * Marks the Pin Code as required.
     */
    required?: boolean;
    /**
     * The validation state.
     */
    state?: PinCodeState;
    /**
     * Adapts the color depending on the theme.
     */
    theme?: Theme;
    /**
     * Pin Code type.
     */
    type?: PinCodeType;
    /**
     * Sets the initial value of the Pin Code.
     */
    value?: string;
};
export declare const PPinCode: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * The description text.
     */
    description?: string;
    /**
     * Disables the Pin Code. No events will be triggered while disabled state is active.
     */
    disabled?: boolean;
    /**
     * The id of a form element the pin-code should be associated with.
     */
    form?: string;
    /**
     * Show or hide label and description text. For better accessibility it is recommended to show the label.
     */
    hideLabel?: BreakpointCustomizable<boolean>;
    /**
     * The label text.
     */
    label?: string;
    /**
     * Number of characters of the Pin Code.
     */
    length?: PinCodeLength;
    /**
     * Disables the Pin Code and shows a loading indicator. No events will be triggered while loading state is active.
     */
    loading?: boolean;
    /**
     * The message styled depending on validation state.
     */
    message?: string;
    /**
     * Name of the control.
     */
    name?: string;
    /**
     * Emitted when selected element changes.
     */
    onUpdate?: (event: CustomEvent<PinCodeUpdateEventDetail>) => void;
    /**
     * Marks the Pin Code as required.
     */
    required?: boolean;
    /**
     * The validation state.
     */
    state?: PinCodeState;
    /**
     * Adapts the color depending on the theme.
     */
    theme?: Theme;
    /**
     * Pin Code type.
     */
    type?: PinCodeType;
    /**
     * Sets the initial value of the Pin Code.
     */
    value?: string;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
