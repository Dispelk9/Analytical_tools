import type { BaseProps } from '../../BaseProps';
import type { TableHeadCellSort } from '../types';
export type PTableHeadCellProps = BaseProps & {
    /**
     * Hides the label but stays accessible for screen readers. This property only takes effect when sort property is not defined.
     */
    hideLabel?: boolean;
    /**
     * Displays slotted text multiline or forced into a single line.
     */
    multiline?: boolean;
    /**
     * Defines sortability properties.
     */
    sort?: TableHeadCellSort;
};
export declare const PTableHeadCell: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Hides the label but stays accessible for screen readers. This property only takes effect when sort property is not defined.
     */
    hideLabel?: boolean;
    /**
     * Displays slotted text multiline or forced into a single line.
     */
    multiline?: boolean;
    /**
     * Defines sortability properties.
     */
    sort?: TableHeadCellSort;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
