import type { BaseProps } from '../../BaseProps';
export type PTableCellProps = BaseProps & {
    /**
     * Displays slotted text multiline or forced into a single line.
     */
    multiline?: boolean;
};
export declare const PTableCell: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Displays slotted text multiline or forced into a single line.
     */
    multiline?: boolean;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
