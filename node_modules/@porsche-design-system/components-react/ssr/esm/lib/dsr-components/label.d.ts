import type { FC } from 'react';
export declare const labelId = "label";
export declare const descriptionId = "description";
type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type LabelProps = {
    hasLabel: boolean;
    hasDescription: boolean;
    host: HTMLElement;
    label: string;
    description?: string;
    htmlFor?: string;
    isRequired?: boolean;
    isLoading?: boolean;
    isDisabled?: boolean;
    formElement?: FormElement;
};
export declare const Label: FC<LabelProps>;
export {};
