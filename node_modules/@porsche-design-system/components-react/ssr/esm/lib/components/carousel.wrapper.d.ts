import type { BaseProps } from '../../BaseProps';
import type { CarouselAlignControls, CarouselAlignHeader, SelectedAriaAttributes, CarouselAriaAttribute, BreakpointCustomizable, CarouselGradientColor, CarouselHeadingSize, CarouselInternationalization, CarouselUpdateEventDetail, CarouselSlidesPerPage, Theme, CarouselWidth } from '../types';
export type PCarouselProps = BaseProps & {
    /**
     * Defines which slide to be active (zero-based numbering).
     */
    activeSlideIndex?: number;
    /**
     * Alignment of slotted controls
     */
    alignControls?: CarouselAlignControls;
    /**
     * Alignment of heading and description
     */
    alignHeader?: CarouselAlignHeader;
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<CarouselAriaAttribute>;
    /**
     * Defines the description used in the carousel.
     */
    description?: string;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `pagination` instead. If true, the carousel will not show pagination bullets at the bottom.
     */
    disablePagination?: BreakpointCustomizable<boolean>;
    /**
     * Indicates whether focus should be set on the center slide. If true, the carousel loops by individual slide; otherwise, it loops by page.
     */
    focusOnCenterSlide?: boolean;
    /**
     * Adapts the background gradient for the left and right edge.
     */
    gradientColor?: CarouselGradientColor;
    /**
     * Defines the heading used in the carousel.
     */
    heading?: string;
    /**
     * Defines the heading size used in the carousel.
     */
    headingSize?: CarouselHeadingSize;
    /**
     * Override the default wordings that are used for aria-labels on the next/prev buttons and pagination.
     */
    intl?: CarouselInternationalization;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `update` event instead. Emitted when carousel's content slides.
     */
    onCarouselChange?: (event: CustomEvent<CarouselUpdateEventDetail>) => void;
    /**
     * Emitted when carousel's content slides.
     */
    onUpdate?: (event: CustomEvent<CarouselUpdateEventDetail>) => void;
    /**
     * If false, the carousel will not show pagination bullets at the bottom.
     */
    pagination?: BreakpointCustomizable<boolean>;
    /**
     * Whether the slides should rewind from last to first slide and vice versa.
     */
    rewind?: boolean;
    /**
     * Defines target of skip link (to skip carousel entries).
     */
    skipLinkTarget?: string;
    /**
     * Sets the amount of slides visible at the same time. Can be set to `auto` if you want to define different widths per slide via CSS.
     */
    slidesPerPage?: BreakpointCustomizable<CarouselSlidesPerPage>;
    /**
     * Adapts the color when used on dark background.
     */
    theme?: Theme;
    /**
     * Determines whether to trim spaces before/after the carousel if `focusOnCenterSlide` option is true.
     */
    trimSpace?: boolean;
    /**
     * Defines the outer spacings between the carousel and the left and right screen sides.
     */
    width?: CarouselWidth;
    /**
     * Has no effect anymore
     * @deprecated since v3.0.0, will be removed with next major release
     */
    wrapContent?: boolean;
};
export declare const PCarousel: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Defines which slide to be active (zero-based numbering).
     */
    activeSlideIndex?: number;
    /**
     * Alignment of slotted controls
     */
    alignControls?: CarouselAlignControls;
    /**
     * Alignment of heading and description
     */
    alignHeader?: CarouselAlignHeader;
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<CarouselAriaAttribute>;
    /**
     * Defines the description used in the carousel.
     */
    description?: string;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `pagination` instead. If true, the carousel will not show pagination bullets at the bottom.
     */
    disablePagination?: BreakpointCustomizable<boolean>;
    /**
     * Indicates whether focus should be set on the center slide. If true, the carousel loops by individual slide; otherwise, it loops by page.
     */
    focusOnCenterSlide?: boolean;
    /**
     * Adapts the background gradient for the left and right edge.
     */
    gradientColor?: CarouselGradientColor;
    /**
     * Defines the heading used in the carousel.
     */
    heading?: string;
    /**
     * Defines the heading size used in the carousel.
     */
    headingSize?: CarouselHeadingSize;
    /**
     * Override the default wordings that are used for aria-labels on the next/prev buttons and pagination.
     */
    intl?: CarouselInternationalization;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `update` event instead. Emitted when carousel's content slides.
     */
    onCarouselChange?: (event: CustomEvent<CarouselUpdateEventDetail>) => void;
    /**
     * Emitted when carousel's content slides.
     */
    onUpdate?: (event: CustomEvent<CarouselUpdateEventDetail>) => void;
    /**
     * If false, the carousel will not show pagination bullets at the bottom.
     */
    pagination?: BreakpointCustomizable<boolean>;
    /**
     * Whether the slides should rewind from last to first slide and vice versa.
     */
    rewind?: boolean;
    /**
     * Defines target of skip link (to skip carousel entries).
     */
    skipLinkTarget?: string;
    /**
     * Sets the amount of slides visible at the same time. Can be set to `auto` if you want to define different widths per slide via CSS.
     */
    slidesPerPage?: BreakpointCustomizable<CarouselSlidesPerPage>;
    /**
     * Adapts the color when used on dark background.
     */
    theme?: Theme;
    /**
     * Determines whether to trim spaces before/after the carousel if `focusOnCenterSlide` option is true.
     */
    trimSpace?: boolean;
    /**
     * Defines the outer spacings between the carousel and the left and right screen sides.
     */
    width?: CarouselWidth;
    /**
     * Has no effect anymore
     * @deprecated since v3.0.0, will be removed with next major release
     */
    wrapContent?: boolean;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
