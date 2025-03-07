import { Component } from 'react';
/**
 * @slot {"name": "heading", "description": "Renders a heading section above the content area.", "isDeprecated": true }
 * @slot {"name": "header", "description": "Renders a header section above the content area." }
 * @slot {"name": "", "description": "Default slot for the main content." }
 * @slot {"name": "footer", "description": "Shows a sticky footer section, flowing under the content area when scrollable." }
 *
 * @controlled {"props": ["open"], "event": "dismiss"}
 */
export declare class DSRModal extends Component<any> {
    host: HTMLElement;
    private dialog;
    private scroller;
    private footer;
    private hasHeader;
    private hasFooter;
    private get hasDismissButton();
    render(): JSX.Element;
}
