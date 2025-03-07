import type { BaseProps } from '../../BaseProps';
import type { SelectedAriaAttributes, FlyoutAriaAttribute, FlyoutFooterBehavior, FlyoutMotionHiddenEndEventDetail, FlyoutMotionVisibleEndEventDetail, FlyoutPosition, Theme } from '../types';
export type PFlyoutProps = BaseProps & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<FlyoutAriaAttribute>;
    /**
     * If true, the flyout will not be closable via backdrop click.
     */
    disableBackdropClick?: boolean;
    /**
     * Determines the footer's position behavior. When set to "fixed," the flyout content stretches to fill the full height, keeping the footer permanently at the bottom. When set to "sticky," the footer flows beneath the content and only becomes fixed if the content overflows.
     */
    footerBehavior?: FlyoutFooterBehavior;
    /**
     * Emitted when the component requests to be dismissed.
     */
    onDismiss?: (event: CustomEvent<void>) => void;
    /**
     * Emitted when the flyout is closed and the transition is finished.
     */
    onMotionHiddenEnd?: (event: CustomEvent<FlyoutMotionHiddenEndEventDetail>) => void;
    /**
     * Emitted when the flyout is opened and the transition is finished.
     */
    onMotionVisibleEnd?: (event: CustomEvent<FlyoutMotionVisibleEndEventDetail>) => void;
    /**
     * If true, the flyout is open.
     */
    open: boolean;
    /**
     * The position of the flyout
     */
    position?: FlyoutPosition;
    /**
     * Adapts the flyout color depending on the theme.
     */
    theme?: Theme;
};
export declare const PFlyout: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<FlyoutAriaAttribute>;
    /**
     * If true, the flyout will not be closable via backdrop click.
     */
    disableBackdropClick?: boolean;
    /**
     * Determines the footer's position behavior. When set to "fixed," the flyout content stretches to fill the full height, keeping the footer permanently at the bottom. When set to "sticky," the footer flows beneath the content and only becomes fixed if the content overflows.
     */
    footerBehavior?: FlyoutFooterBehavior;
    /**
     * Emitted when the component requests to be dismissed.
     */
    onDismiss?: (event: CustomEvent<void>) => void;
    /**
     * Emitted when the flyout is closed and the transition is finished.
     */
    onMotionHiddenEnd?: (event: CustomEvent<FlyoutMotionHiddenEndEventDetail>) => void;
    /**
     * Emitted when the flyout is opened and the transition is finished.
     */
    onMotionVisibleEnd?: (event: CustomEvent<FlyoutMotionVisibleEndEventDetail>) => void;
    /**
     * If true, the flyout is open.
     */
    open: boolean;
    /**
     * The position of the flyout
     */
    position?: FlyoutPosition;
    /**
     * Adapts the flyout color depending on the theme.
     */
    theme?: Theme;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
