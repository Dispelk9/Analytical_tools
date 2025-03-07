import { Component } from 'react';
/**
 * @slot {"name": "header", "description": "Renders a header section above the content area." }
 * @slot {"name": "", "description": "Default slot for the main content." }
 *
 * @controlled {"props": ["open"], "event": "dismiss"}
 */
export declare class DSRSheet extends Component<any> {
    host: HTMLElement;
    private dialog;
    private scroller;
    private hasHeader;
    render(): JSX.Element;
}
