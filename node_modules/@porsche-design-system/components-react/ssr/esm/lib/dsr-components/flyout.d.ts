import { Component } from 'react';
/**
 * @slot {"name": "header", "description": "Renders a sticky header section above the content area." }
 * @slot {"name": "", "description": "Default slot for the main content." }
 * @slot {"name": "footer", "description": "Shows a sticky footer section, flowing under the content area when scrollable." }
 * @slot {"name": "sub-footer", "description": "Shows a sub-footer section to display additional information below the footer. This slot is ideal for less critical content, such as legal information or FAQs, which provides further details to the user. It appears when scrolling to the end of the flyout or when there is available space to accommodate the content." }
 *
 * @controlled {"props": ["open"], "event": "dismiss"}
 */
export declare class DSRFlyout extends Component<any> {
    host: HTMLElement;
    private dialog;
    private scroller;
    private header;
    private footer;
    private hasHeader;
    private hasFooter;
    private hasSubFooter;
    render(): JSX.Element;
}
