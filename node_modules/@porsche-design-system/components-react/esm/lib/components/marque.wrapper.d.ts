import type { BaseProps } from '../../BaseProps';
import type { SelectedAriaAttributes, MarqueAriaAttribute, MarqueSize, MarqueTarget, MarqueVariant } from '../types';
export type PMarqueProps = BaseProps & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<MarqueAriaAttribute>;
    /**
     * When providing an url then the component will be rendered as `<a>`.
     */
    href?: string;
    /**
     * Adapts sizing of marque.
     */
    size?: MarqueSize;
    /**
     * Target attribute where the link should be opened.
     */
    target?: MarqueTarget;
    /**
     * Show/hide trademark sign (only has effect when variant is set to default).
     */
    trademark?: boolean;
    /**
     * Shows marque in special editions
     */
    variant?: MarqueVariant;
};
/** @deprecated since v3.0.0, will be removed with next major release. Please use "p-wordmark" instead. */
export declare const PMarque: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<MarqueAriaAttribute>;
    /**
     * When providing an url then the component will be rendered as `<a>`.
     */
    href?: string;
    /**
     * Adapts sizing of marque.
     */
    size?: MarqueSize;
    /**
     * Target attribute where the link should be opened.
     */
    target?: MarqueTarget;
    /**
     * Show/hide trademark sign (only has effect when variant is set to default).
     */
    trademark?: boolean;
    /**
     * Shows marque in special editions
     */
    variant?: MarqueVariant;
} & import("react").RefAttributes<HTMLElement>>;
