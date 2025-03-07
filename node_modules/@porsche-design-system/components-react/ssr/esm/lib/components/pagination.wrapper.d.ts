import type { BaseProps } from '../../BaseProps';
import type { PaginationInternationalization, BreakpointCustomizable, PaginationMaxNumberOfPageLinks, PaginationUpdateEventDetail, Theme } from '../types';
export type PPaginationProps = BaseProps & {
    /**
     * Index of the currently active page.
     */
    activePage: number;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `intl.root` instead. Aria label what the pagination is used for.
     */
    allyLabel?: string;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `intl.next` instead. Aria label for next page icon.
     */
    allyLabelNext?: string;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `intl.page` instead. Aria label for page navigation.
     */
    allyLabelPage?: string;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `intl.prev` instead. Aria label for previous page icon.
     */
    allyLabelPrev?: string;
    /**
     * Override the default wordings that are used for aria-labels on the next/prev and page buttons.
     */
    intl?: PaginationInternationalization;
    /**
     * The total count of items which should be shown per page.
     */
    itemsPerPage?: number;
    /**
     * Has no effect anymore
     * @deprecated since v3.10.0, will be removed with next major release
     */
    maxNumberOfPageLinks?: BreakpointCustomizable<PaginationMaxNumberOfPageLinks>;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `update` event instead. Emitted when the page changes.
     */
    onPageChange?: (event: CustomEvent<PaginationUpdateEventDetail>) => void;
    /**
     * Emitted when the page changes.
     */
    onUpdate?: (event: CustomEvent<PaginationUpdateEventDetail>) => void;
    /**
     * Show or hide the button to jump to the last page.
     */
    showLastPage?: boolean;
    /**
     * Adapts the color when used on dark background.
     */
    theme?: Theme;
    /**
     * The total count of items.
     */
    totalItemsCount: number;
};
export declare const PPagination: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Index of the currently active page.
     */
    activePage: number;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `intl.root` instead. Aria label what the pagination is used for.
     */
    allyLabel?: string;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `intl.next` instead. Aria label for next page icon.
     */
    allyLabelNext?: string;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `intl.page` instead. Aria label for page navigation.
     */
    allyLabelPage?: string;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `intl.prev` instead. Aria label for previous page icon.
     */
    allyLabelPrev?: string;
    /**
     * Override the default wordings that are used for aria-labels on the next/prev and page buttons.
     */
    intl?: PaginationInternationalization;
    /**
     * The total count of items which should be shown per page.
     */
    itemsPerPage?: number;
    /**
     * Has no effect anymore
     * @deprecated since v3.10.0, will be removed with next major release
     */
    maxNumberOfPageLinks?: BreakpointCustomizable<PaginationMaxNumberOfPageLinks>;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `update` event instead. Emitted when the page changes.
     */
    onPageChange?: (event: CustomEvent<PaginationUpdateEventDetail>) => void;
    /**
     * Emitted when the page changes.
     */
    onUpdate?: (event: CustomEvent<PaginationUpdateEventDetail>) => void;
    /**
     * Show or hide the button to jump to the last page.
     */
    showLastPage?: boolean;
    /**
     * Adapts the color when used on dark background.
     */
    theme?: Theme;
    /**
     * The total count of items.
     */
    totalItemsCount: number;
} & import("react").RefAttributes<HTMLElement>>;
