import type { BaseProps } from '../../BaseProps';
export type PTabsItemProps = BaseProps & {
    /**
     * Defines the label used in tabs.
     */
    label: string;
};
export declare const PTabsItem: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Defines the label used in tabs.
     */
    label: string;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
