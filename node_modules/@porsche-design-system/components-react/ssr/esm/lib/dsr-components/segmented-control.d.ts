import { Component } from 'react';
/**
 * @slot {"name": "", "description": "Default slot for the `p-segmented-control-item` tags." }
 *
 * @controlled { "props": ["value"], "event": "update", "isInternallyMutated": true }
 */
export declare class DSRSegmentedControl extends Component<any> {
    host: HTMLElement;
    private internals;
    private defaultValue;
    formResetCallback(): void;
    formDisabledCallback(): void;
    formStateRestoreCallback(): void;
    render(): JSX.Element;
}
