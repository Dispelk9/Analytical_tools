import type { BaseProps } from '../../BaseProps';
import type { StepperHorizontalUpdateEventDetail, BreakpointCustomizable, StepperHorizontalSize, Theme } from '../types';
export type PStepperHorizontalProps = BaseProps & {
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `update` event instead. Emitted when active step is changed.
     */
    onStepChange?: (event: CustomEvent<StepperHorizontalUpdateEventDetail>) => void;
    /**
     * Emitted when active step is changed.
     */
    onUpdate?: (event: CustomEvent<StepperHorizontalUpdateEventDetail>) => void;
    /**
     * The text size.
     */
    size?: BreakpointCustomizable<StepperHorizontalSize>;
    /**
     * Adapts the tag color depending on the theme.
     */
    theme?: Theme;
};
export declare const PStepperHorizontal: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `update` event instead. Emitted when active step is changed.
     */
    onStepChange?: (event: CustomEvent<StepperHorizontalUpdateEventDetail>) => void;
    /**
     * Emitted when active step is changed.
     */
    onUpdate?: (event: CustomEvent<StepperHorizontalUpdateEventDetail>) => void;
    /**
     * The text size.
     */
    size?: BreakpointCustomizable<StepperHorizontalSize>;
    /**
     * Adapts the tag color depending on the theme.
     */
    theme?: Theme;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
