import type { BaseProps } from '../../BaseProps';
export type PSelectOptionProps = BaseProps & {
    /**
     * Disables the option.
     */
    disabled?: boolean;
    /**
     * The option value.
     */
    value?: string;
};
export declare const PSelectOption: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Disables the option.
     */
    disabled?: boolean;
    /**
     * The option value.
     */
    value?: string;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
