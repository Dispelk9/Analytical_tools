import type { BaseProps } from '../../BaseProps';
import type { TableLayout, TableUpdateEventDetail, Theme } from '../types';
export type PTableProps = BaseProps & {
    /**
     * A caption describing the contents of the table for accessibility only. This won't be visible in the browser. Use an element with an attribute of `slot="caption"` for a visible caption.
     */
    caption?: string;
    /**
     * Displays as compact version.
     */
    compact?: boolean;
    /**
     * Controls the layout behavior of the table.
     */
    layout?: TableLayout;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `update` event instead. Emitted when sorting is changed.
     */
    onSortingChange?: (event: CustomEvent<TableUpdateEventDetail>) => void;
    /**
     * Emitted when sorting is changed.
     */
    onUpdate?: (event: CustomEvent<TableUpdateEventDetail>) => void;
    /**
     * Adapts the color when used on dark background.
     */
    theme?: Theme;
};
export declare const PTable: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * A caption describing the contents of the table for accessibility only. This won't be visible in the browser. Use an element with an attribute of `slot="caption"` for a visible caption.
     */
    caption?: string;
    /**
     * Displays as compact version.
     */
    compact?: boolean;
    /**
     * Controls the layout behavior of the table.
     */
    layout?: TableLayout;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `update` event instead. Emitted when sorting is changed.
     */
    onSortingChange?: (event: CustomEvent<TableUpdateEventDetail>) => void;
    /**
     * Emitted when sorting is changed.
     */
    onUpdate?: (event: CustomEvent<TableUpdateEventDetail>) => void;
    /**
     * Adapts the color when used on dark background.
     */
    theme?: Theme;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
