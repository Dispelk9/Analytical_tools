import { Component } from 'react';
/**
 * @slot {"name": "label", "description": "Shows a label. Only [phrasing content](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#Phrasing_content) is allowed." }
 * @slot {"name": "description", "description": "Shows a description. Only [phrasing content](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#Phrasing_content) is allowed." }
 * @slot {"name": "message", "description": "Shows a state message. Only [phrasing content](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#Phrasing_content) is allowed." }
 *
 * @controlled { "props": ["value"], "event": "update", "isInternallyMutated": true }
 */
export declare class DSRPinCode extends Component<any> {
    host: HTMLElement;
    private internals;
    private initialLoading;
    private defaultValue;
    private inputElements;
    formResetCallback(): void;
    formDisabledCallback(): void;
    formStateRestoreCallback(): void;
    render(): JSX.Element;
}
