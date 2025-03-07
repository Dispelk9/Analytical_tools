import type { BaseProps } from '../../BaseProps';
import type { StepperHorizontalItemState } from '../types';
export type PStepperHorizontalItemProps = BaseProps & {
    /**
     * Disables the stepper-horizontal-item. No events will be triggered while disabled state is active.
     */
    disabled?: boolean;
    /**
     * The validation state.
     */
    state?: StepperHorizontalItemState;
};
export declare const PStepperHorizontalItem: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Disables the stepper-horizontal-item. No events will be triggered while disabled state is active.
     */
    disabled?: boolean;
    /**
     * The validation state.
     */
    state?: StepperHorizontalItemState;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
