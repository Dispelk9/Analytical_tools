import type { BaseProps } from '../../BaseProps';
import type { SelectedAriaAttributes, WordmarkAriaAttribute, WordmarkSize, WordmarkTarget, Theme } from '../types';
export type PWordmarkProps = BaseProps & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<WordmarkAriaAttribute>;
    /**
     * When providing an url then the component will be rendered as `<a>`.
     */
    href?: string;
    /**
     * Adapts sizing of wordmark.
     */
    size?: WordmarkSize;
    /**
     * Target attribute where the link should be opened.
     */
    target?: WordmarkTarget;
    /**
     * Adapts color depending on theme.
     */
    theme?: Theme;
};
export declare const PWordmark: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<WordmarkAriaAttribute>;
    /**
     * When providing an url then the component will be rendered as `<a>`.
     */
    href?: string;
    /**
     * Adapts sizing of wordmark.
     */
    size?: WordmarkSize;
    /**
     * Target attribute where the link should be opened.
     */
    target?: WordmarkTarget;
    /**
     * Adapts color depending on theme.
     */
    theme?: Theme;
} & import("react").RefAttributes<HTMLElement>>;
