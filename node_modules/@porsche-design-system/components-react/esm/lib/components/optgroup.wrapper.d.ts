import type { BaseProps } from '../../BaseProps';
export type POptgroupProps = BaseProps & {
    /**
     * Disables the optgroup.
     */
    disabled?: boolean;
    /**
     * The optgroup label.
     */
    label?: string;
};
export declare const POptgroup: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Disables the optgroup.
     */
    disabled?: boolean;
    /**
     * The optgroup label.
     */
    label?: string;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
