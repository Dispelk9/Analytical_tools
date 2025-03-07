import type { BaseProps } from '../../BaseProps';
import type { BreakpointCustomizable, CheckboxBlurEventDetail, CheckboxUpdateEventDetail, CheckboxState, Theme } from '../types';
export type PCheckboxProps = BaseProps & {
    /**
     * Reflects the checkbox current checked state and allows setting the initial checked state.
     */
    checked?: boolean;
    /**
     * Displays as compact version.
     */
    compact?: boolean;
    /**
     * Marks the checkbox as disabled.
     */
    disabled?: boolean;
    /**
     * The id of a form element the checkbox should be associated with.
     */
    form?: string;
    /**
     * Show or hide label. For better accessibility it's recommended to show the label.
     */
    hideLabel?: BreakpointCustomizable<boolean>;
    /**
     * Marks the checkbox as indeterminate.
     */
    indeterminate?: boolean;
    /**
     * The label text.
     */
    label?: string;
    /**
     * @experimental Disables the checkbox and shows a loading indicator.
     */
    loading?: boolean;
    /**
     * The message styled depending on validation state.
     */
    message?: string;
    /**
     * The name of the checkbox.
     */
    name?: string;
    /**
     * Emitted when the checkbox has lost focus.
     */
    onBlur?: (event: CustomEvent<CheckboxBlurEventDetail>) => void;
    /**
     * Emitted when checkbox checked property is changed.
     */
    onUpdate?: (event: CustomEvent<CheckboxUpdateEventDetail>) => void;
    /**
     * Marks the checkbox as required.
     */
    required?: boolean;
    /**
     * The validation state.
     */
    state?: CheckboxState;
    /**
     * Adapts the color depending on the theme.
     */
    theme?: Theme;
    /**
     * The checkbox value. When a form is submitted, only a checkbox which is currently checked is included in the submission.
     */
    value?: string;
};
export declare const PCheckbox: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Reflects the checkbox current checked state and allows setting the initial checked state.
     */
    checked?: boolean;
    /**
     * Displays as compact version.
     */
    compact?: boolean;
    /**
     * Marks the checkbox as disabled.
     */
    disabled?: boolean;
    /**
     * The id of a form element the checkbox should be associated with.
     */
    form?: string;
    /**
     * Show or hide label. For better accessibility it's recommended to show the label.
     */
    hideLabel?: BreakpointCustomizable<boolean>;
    /**
     * Marks the checkbox as indeterminate.
     */
    indeterminate?: boolean;
    /**
     * The label text.
     */
    label?: string;
    /**
     * @experimental Disables the checkbox and shows a loading indicator.
     */
    loading?: boolean;
    /**
     * The message styled depending on validation state.
     */
    message?: string;
    /**
     * The name of the checkbox.
     */
    name?: string;
    /**
     * Emitted when the checkbox has lost focus.
     */
    onBlur?: (event: CustomEvent<CheckboxBlurEventDetail>) => void;
    /**
     * Emitted when checkbox checked property is changed.
     */
    onUpdate?: (event: CustomEvent<CheckboxUpdateEventDetail>) => void;
    /**
     * Marks the checkbox as required.
     */
    required?: boolean;
    /**
     * The validation state.
     */
    state?: CheckboxState;
    /**
     * Adapts the color depending on the theme.
     */
    theme?: Theme;
    /**
     * The checkbox value. When a form is submitted, only a checkbox which is currently checked is included in the submission.
     */
    value?: string;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
