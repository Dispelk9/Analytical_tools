import { Component } from 'react';
/**
 * @slot {"name": "heading", "description": "Defines the heading used in the accordion. Can be used alternatively to the heading prop. Please **refrain** from using any other than text content as slotted markup." }
 * @slot {"name": "", "description": "Default slot for the main content" }
 *
 * @controlled {"props": ["open"], "event": "update"}
 */
export declare class DSRAccordion extends Component<any> {
    host: HTMLElement;
    render(): JSX.Element;
}
