import { Component } from 'react';
/**
 * @slot {"name": "", "description": "Default slot for the scroller content." }
 */
export declare class DSRScroller extends Component<any> {
    host: HTMLElement;
    private isPrevHidden;
    private isNextHidden;
    private intersectionObserver;
    private scrollAreaElement;
    render(): JSX.Element;
}
