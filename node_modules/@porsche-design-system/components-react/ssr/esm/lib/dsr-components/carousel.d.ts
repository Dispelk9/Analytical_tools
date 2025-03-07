import { Component } from 'react';
/**
 * @slot {"name": "heading", "description": "Renders a heading above the carousel." }
 * @slot {"name": "description", "description": "Shows a footer section, flowing under the content area when scrollable." }
 * @slot {"name": "controls", "description": "Shows a sidebar area on the **start** side (**left** in **LTR** mode / **right** in **RTL** mode). On mobile view it transforms into a flyout." }
 * @slot {"name": "", "description": "Default slot for the carousel slides." }
 *
 * @controlled { "props": ["activeSlideIndex"], "event": "update", "isInternallyMutated": true }
 */
export declare class DSRCarousel extends Component<any> {
    host: HTMLElement;
    private amountOfPages;
    private splide;
    private container;
    private btnPrev;
    private btnNext;
    private paginationEl;
    private slides;
    private get splideSlides();
    private get hasNavigation();
    render(): JSX.Element;
    private getPageCount;
}
