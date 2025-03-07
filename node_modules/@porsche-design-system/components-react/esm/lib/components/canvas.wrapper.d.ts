import type { BaseProps } from '../../BaseProps';
import type { CanvasSidebarStartUpdateEventDetail, Theme } from '../types';
export type PCanvasProps = BaseProps & {
    /**
     * Emitted when the sidebar end requests to be dismissed.
     */
    onSidebarEndDismiss?: (event: CustomEvent<void>) => void;
    /**
     * Emitted when the sidebar start requests to be opened or dismissed.
     */
    onSidebarStartUpdate?: (event: CustomEvent<CanvasSidebarStartUpdateEventDetail>) => void;
    /**
     * Open the sidebar on the end side
     */
    sidebarEndOpen?: boolean;
    /**
     * Open the sidebar on the start side
     */
    sidebarStartOpen?: boolean;
    /**
     * Adapts the color depending on the theme.
     */
    theme?: Theme;
};
export declare const PCanvas: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Emitted when the sidebar end requests to be dismissed.
     */
    onSidebarEndDismiss?: (event: CustomEvent<void>) => void;
    /**
     * Emitted when the sidebar start requests to be opened or dismissed.
     */
    onSidebarStartUpdate?: (event: CustomEvent<CanvasSidebarStartUpdateEventDetail>) => void;
    /**
     * Open the sidebar on the end side
     */
    sidebarEndOpen?: boolean;
    /**
     * Open the sidebar on the start side
     */
    sidebarStartOpen?: boolean;
    /**
     * Adapts the color depending on the theme.
     */
    theme?: Theme;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
