import { Component } from 'react';
export declare class DSRSelectWrapperDropdown extends Component<any> {
    host: HTMLElement;
    private isOpen;
    private optionMaps;
    private searchString;
    private inputOrButtonElement;
    private popoverElement;
    private hasNativePopoverSupport;
    private cleanUpAutoUpdate;
    private get selectedIndex();
    render(): JSX.Element;
}
