import type { BaseProps } from '../../BaseProps';
import type { SelectedAriaAttributes, SpinnerAriaAttribute, BreakpointCustomizable, SpinnerSize, Theme } from '../types';
export type PSpinnerProps = BaseProps & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<SpinnerAriaAttribute>;
    /**
     * Size of the spinner.
     */
    size?: BreakpointCustomizable<SpinnerSize>;
    /**
     * Adapts the spinner color depending on the theme.
     */
    theme?: Theme;
};
export declare const PSpinner: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<SpinnerAriaAttribute>;
    /**
     * Size of the spinner.
     */
    size?: BreakpointCustomizable<SpinnerSize>;
    /**
     * Adapts the spinner color depending on the theme.
     */
    theme?: Theme;
} & import("react").RefAttributes<HTMLElement>>;
