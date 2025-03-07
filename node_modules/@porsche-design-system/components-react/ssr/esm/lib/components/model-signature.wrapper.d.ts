import type { BaseProps } from '../../BaseProps';
import type { ModelSignatureColor, ModelSignatureFetchPriority, ModelSignatureModel, ModelSignatureSize, Theme } from '../types';
export type PModelSignatureProps = BaseProps & {
    /**
     * Adapts the color of the component.
     */
    color?: ModelSignatureColor;
    /**
     * Defines the fetch priority of the model signature. In the end it is just a recommendation to the browser, but it defines the priority on its own.
     */
    fetchPriority?: ModelSignatureFetchPriority;
    /**
     * Defines whether the model signature is always loaded or only loaded when it is in the viewport (this feature may not work reliably).
     */
    lazy?: boolean;
    /**
     * Adapts the model of the component.
     */
    model?: ModelSignatureModel;
    /**
     * When set to `true`, then all model signatures are visually aligned with each other. When set to `false` the model signature comes without any safe zone.
     */
    safeZone?: boolean;
    /**
     * Adapts the size of the component. When set to `inherit` a CSS `width` or `height` needs to be defined on the host but not both.
     */
    size?: ModelSignatureSize;
    /**
     * Adapts color depending on theme.
     */
    theme?: Theme;
};
export declare const PModelSignature: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Adapts the color of the component.
     */
    color?: ModelSignatureColor;
    /**
     * Defines the fetch priority of the model signature. In the end it is just a recommendation to the browser, but it defines the priority on its own.
     */
    fetchPriority?: ModelSignatureFetchPriority;
    /**
     * Defines whether the model signature is always loaded or only loaded when it is in the viewport (this feature may not work reliably).
     */
    lazy?: boolean;
    /**
     * Adapts the model of the component.
     */
    model?: ModelSignatureModel;
    /**
     * When set to `true`, then all model signatures are visually aligned with each other. When set to `false` the model signature comes without any safe zone.
     */
    safeZone?: boolean;
    /**
     * Adapts the size of the component. When set to `inherit` a CSS `width` or `height` needs to be defined on the host but not both.
     */
    size?: ModelSignatureSize;
    /**
     * Adapts color depending on theme.
     */
    theme?: Theme;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
