import { Component } from 'react';
/**
 * @slot {"name": "", "description": "Default slot for the `button` or `a` tags which will be rendered as tabs." }
 *
 * @controlled {"props": ["activeTabIndex"], "event": "update"}
 */
export declare class DSRTabsBar extends Component<any> {
    host: HTMLElement;
    private tabElements;
    private internalTabIndex;
    private barElement;
    private scrollerElement;
    private direction;
    private hasPTabsParent;
    private areTabsButtons;
    render(): JSX.Element;
}
