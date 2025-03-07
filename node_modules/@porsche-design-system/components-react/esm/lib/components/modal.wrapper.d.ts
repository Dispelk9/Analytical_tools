import type { BaseProps } from '../../BaseProps';
import type { SelectedAriaAttributes, ModalAriaAttribute, ModalBackdrop, BreakpointCustomizable, ModalMotionHiddenEndEventDetail, ModalMotionVisibleEndEventDetail, Theme } from '../types';
export type PModalProps = BaseProps & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<ModalAriaAttribute>;
    /**
     * Defines the backdrop, 'blur' (should be used when Modal is opened by user interaction, e.g. after a click on a button) and 'shading' (should be used when Modal gets opened automatically, e.g. Cookie Consent).
     */
    backdrop?: ModalBackdrop;
    /**
     * If true, the modal will not be closable via backdrop click.
     */
    disableBackdropClick?: boolean;
    /**
     * If true, the modal will not have a dismiss button.
     * @deprecated since v3.0.0, will be removed with next major release, use `dismissButton` instead.
     */
    disableCloseButton?: boolean;
    /**
     * If false, the modal will not have a dismiss button.
     */
    dismissButton?: boolean;
    /**
     * If true the modal uses max viewport height and width. Should only be used for mobile.
     */
    fullscreen?: BreakpointCustomizable<boolean>;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `header` slot instead The title of the modal
     */
    heading?: string;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `dismiss` event instead. Emitted when the component requests to be dismissed.
     */
    onClose?: (event: CustomEvent<void>) => void;
    /**
     * Emitted when the component requests to be dismissed.
     */
    onDismiss?: (event: CustomEvent<void>) => void;
    /**
     * Emitted when the modal is closed and the transition is finished.
     */
    onMotionHiddenEnd?: (event: CustomEvent<ModalMotionHiddenEndEventDetail>) => void;
    /**
     * Emitted when the modal is opened and the transition is finished.
     */
    onMotionVisibleEnd?: (event: CustomEvent<ModalMotionVisibleEndEventDetail>) => void;
    /**
     * If true, the modal is open.
     */
    open: boolean;
    /**
     * Adapts the modal color depending on the theme.
     */
    theme?: Theme;
};
export declare const PModal: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<ModalAriaAttribute>;
    /**
     * Defines the backdrop, 'blur' (should be used when Modal is opened by user interaction, e.g. after a click on a button) and 'shading' (should be used when Modal gets opened automatically, e.g. Cookie Consent).
     */
    backdrop?: ModalBackdrop;
    /**
     * If true, the modal will not be closable via backdrop click.
     */
    disableBackdropClick?: boolean;
    /**
     * If true, the modal will not have a dismiss button.
     * @deprecated since v3.0.0, will be removed with next major release, use `dismissButton` instead.
     */
    disableCloseButton?: boolean;
    /**
     * If false, the modal will not have a dismiss button.
     */
    dismissButton?: boolean;
    /**
     * If true the modal uses max viewport height and width. Should only be used for mobile.
     */
    fullscreen?: BreakpointCustomizable<boolean>;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `header` slot instead The title of the modal
     */
    heading?: string;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `dismiss` event instead. Emitted when the component requests to be dismissed.
     */
    onClose?: (event: CustomEvent<void>) => void;
    /**
     * Emitted when the component requests to be dismissed.
     */
    onDismiss?: (event: CustomEvent<void>) => void;
    /**
     * Emitted when the modal is closed and the transition is finished.
     */
    onMotionHiddenEnd?: (event: CustomEvent<ModalMotionHiddenEndEventDetail>) => void;
    /**
     * Emitted when the modal is opened and the transition is finished.
     */
    onMotionVisibleEnd?: (event: CustomEvent<ModalMotionVisibleEndEventDetail>) => void;
    /**
     * If true, the modal is open.
     */
    open: boolean;
    /**
     * Adapts the modal color depending on the theme.
     */
    theme?: Theme;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
