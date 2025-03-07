"use client";
import { jsx } from 'react/jsx-runtime';
import { forwardRef, useRef } from 'react';
import { useEventCallback, usePrefix, useTheme, useBrowserLayoutEffect, useMergedClass } from '../../hooks.mjs';
import { syncRef } from '../../utils.mjs';

const PCarousel = /*#__PURE__*/ forwardRef(({ activeSlideIndex = 0, alignControls = 'auto', alignHeader = 'start', aria, description, disablePagination, focusOnCenterSlide = false, gradientColor = 'none', heading, headingSize = 'x-large', intl, onCarouselChange, onUpdate, pagination = true, rewind = true, skipLinkTarget, slidesPerPage = 1, theme, trimSpace = true, width = 'basic', wrapContent, className, ...rest }, ref) => {
    const elementRef = useRef(undefined);
    useEventCallback(elementRef, 'carouselChange', onCarouselChange);
    useEventCallback(elementRef, 'update', onUpdate);
    const WebComponentTag = usePrefix('p-carousel');
    const propsToSync = [activeSlideIndex, alignControls, alignHeader, aria, description, disablePagination, focusOnCenterSlide, gradientColor, heading, headingSize, intl, pagination, rewind, skipLinkTarget, slidesPerPage, theme || useTheme(), trimSpace, width, wrapContent];
    useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['activeSlideIndex', 'alignControls', 'alignHeader', 'aria', 'description', 'disablePagination', 'focusOnCenterSlide', 'gradientColor', 'heading', 'headingSize', 'intl', 'pagination', 'rewind', 'skipLinkTarget', 'slidesPerPage', 'theme', 'trimSpace', 'width', 'wrapContent'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: useMergedClass(elementRef, className),
        ref: syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsx(WebComponentTag, { ...props });
});

export { PCarousel };
