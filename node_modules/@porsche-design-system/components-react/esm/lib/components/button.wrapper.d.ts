import type { BaseProps } from '../../BaseProps';
import type { SelectedAriaAttributes, ButtonAriaAttribute, BreakpointCustomizable, ButtonIcon, Theme, ButtonType, ButtonVariant } from '../types';
export type PButtonProps = BaseProps & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<ButtonAriaAttribute>;
    /**
     * Displays as compact version.
     */
    compact?: BreakpointCustomizable<boolean>;
    /**
     * Disables the button. No events will be triggered while disabled state is active.
     */
    disabled?: boolean;
    /**
     * The id of a form element the button should be associated with.
     */
    form?: string;
    /**
     * Show or hide label. For better accessibility it is recommended to show the label.
     */
    hideLabel?: BreakpointCustomizable<boolean>;
    /**
     * The icon shown. By choosing 'none', no icon is displayed.
     */
    icon?: ButtonIcon;
    /**
     * A URL path to a custom icon.
     */
    iconSource?: string;
    /**
     * Disables the button and shows a loading indicator. No events will be triggered while loading state is active.
     */
    loading?: boolean;
    /**
     * The name of the button, submitted as a pair with the button's value as part of the form data, when that button is used to submit the form.
     */
    name?: string;
    /**
     * Adapts the button color depending on the theme.
     */
    theme?: Theme;
    /**
     * Specifies the type of the button.
     */
    type?: ButtonType;
    /**
     * Defines the value associated with the button's name when it's submitted with the form data. This value is passed to the server in params when the form is submitted using this button.
     */
    value?: string;
    /**
     * The style variant of the button.
     */
    variant?: ButtonVariant;
};
export declare const PButton: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<ButtonAriaAttribute>;
    /**
     * Displays as compact version.
     */
    compact?: BreakpointCustomizable<boolean>;
    /**
     * Disables the button. No events will be triggered while disabled state is active.
     */
    disabled?: boolean;
    /**
     * The id of a form element the button should be associated with.
     */
    form?: string;
    /**
     * Show or hide label. For better accessibility it is recommended to show the label.
     */
    hideLabel?: BreakpointCustomizable<boolean>;
    /**
     * The icon shown. By choosing 'none', no icon is displayed.
     */
    icon?: ButtonIcon;
    /**
     * A URL path to a custom icon.
     */
    iconSource?: string;
    /**
     * Disables the button and shows a loading indicator. No events will be triggered while loading state is active.
     */
    loading?: boolean;
    /**
     * The name of the button, submitted as a pair with the button's value as part of the form data, when that button is used to submit the form.
     */
    name?: string;
    /**
     * Adapts the button color depending on the theme.
     */
    theme?: Theme;
    /**
     * Specifies the type of the button.
     */
    type?: ButtonType;
    /**
     * Defines the value associated with the button's name when it's submitted with the form data. This value is passed to the server in params when the form is submitted using this button.
     */
    value?: string;
    /**
     * The style variant of the button.
     */
    variant?: ButtonVariant;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
