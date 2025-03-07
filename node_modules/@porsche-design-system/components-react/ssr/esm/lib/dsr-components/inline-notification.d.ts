import { Component } from 'react';
/**
 * @slot {"name": "heading", "description": "Shows a heading. Can be used to render rich markup." }
 * @slot {"name": "", "description": "Default slot to render a description. Can be used to render rich markup." }
 */
export declare class DSRInlineNotification extends Component<any> {
    host: HTMLElement;
    private get hasDismissButton();
    render(): JSX.Element;
}
