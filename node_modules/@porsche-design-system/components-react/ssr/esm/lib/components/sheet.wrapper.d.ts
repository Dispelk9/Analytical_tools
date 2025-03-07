import type { BaseProps } from '../../BaseProps';
import type { SelectedAriaAttributes, SheetAriaAttribute, SheetMotionHiddenEndEventDetail, SheetMotionVisibleEndEventDetail, Theme } from '../types';
export type PSheetProps = BaseProps & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<SheetAriaAttribute>;
    /**
     * If true, the sheet will not be closable via backdrop click.
     */
    disableBackdropClick?: boolean;
    /**
     * If false, the sheet will not have a dismiss button.
     */
    dismissButton?: boolean;
    /**
     * Emitted when the component requests to be dismissed.
     */
    onDismiss?: (event: CustomEvent<void>) => void;
    /**
     * Emitted when the sheet is closed and the transition is finished.
     */
    onMotionHiddenEnd?: (event: CustomEvent<SheetMotionHiddenEndEventDetail>) => void;
    /**
     * Emitted when the sheet is opened and the transition is finished.
     */
    onMotionVisibleEnd?: (event: CustomEvent<SheetMotionVisibleEndEventDetail>) => void;
    /**
     * If true, the sheet is open.
     */
    open: boolean;
    /**
     * Adapts the sheet color depending on the theme.
     */
    theme?: Theme;
};
export declare const PSheet: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<SheetAriaAttribute>;
    /**
     * If true, the sheet will not be closable via backdrop click.
     */
    disableBackdropClick?: boolean;
    /**
     * If false, the sheet will not have a dismiss button.
     */
    dismissButton?: boolean;
    /**
     * Emitted when the component requests to be dismissed.
     */
    onDismiss?: (event: CustomEvent<void>) => void;
    /**
     * Emitted when the sheet is closed and the transition is finished.
     */
    onMotionHiddenEnd?: (event: CustomEvent<SheetMotionHiddenEndEventDetail>) => void;
    /**
     * Emitted when the sheet is opened and the transition is finished.
     */
    onMotionVisibleEnd?: (event: CustomEvent<SheetMotionVisibleEndEventDetail>) => void;
    /**
     * If true, the sheet is open.
     */
    open: boolean;
    /**
     * Adapts the sheet color depending on the theme.
     */
    theme?: Theme;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
