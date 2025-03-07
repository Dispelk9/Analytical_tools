"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../hooks.cjs');
var utils = require('../../utils.cjs');

const PCarousel = /*#__PURE__*/ react.forwardRef(({ activeSlideIndex = 0, alignControls = 'auto', alignHeader = 'start', aria, description, disablePagination, focusOnCenterSlide = false, gradientColor = 'none', heading, headingSize = 'x-large', intl, onCarouselChange, onUpdate, pagination = true, rewind = true, skipLinkTarget, slidesPerPage = 1, theme, trimSpace = true, width = 'basic', wrapContent, className, ...rest }, ref) => {
    const elementRef = react.useRef(undefined);
    hooks.useEventCallback(elementRef, 'carouselChange', onCarouselChange);
    hooks.useEventCallback(elementRef, 'update', onUpdate);
    const WebComponentTag = hooks.usePrefix('p-carousel');
    const propsToSync = [activeSlideIndex, alignControls, alignHeader, aria, description, disablePagination, focusOnCenterSlide, gradientColor, heading, headingSize, intl, pagination, rewind, skipLinkTarget, slidesPerPage, theme || hooks.useTheme(), trimSpace, width, wrapContent];
    hooks.useBrowserLayoutEffect(() => {
        const { current } = elementRef;
        ['activeSlideIndex', 'alignControls', 'alignHeader', 'aria', 'description', 'disablePagination', 'focusOnCenterSlide', 'gradientColor', 'heading', 'headingSize', 'intl', 'pagination', 'rewind', 'skipLinkTarget', 'slidesPerPage', 'theme', 'trimSpace', 'width', 'wrapContent'].forEach((propName, i) => (current[propName] = propsToSync[i]));
    }, propsToSync);
    const props = {
        ...rest,
        class: hooks.useMergedClass(elementRef, className),
        ref: utils.syncRef(elementRef, ref)
    };
    // @ts-ignore
    return jsxRuntime.jsx(WebComponentTag, { ...props });
});

exports.PCarousel = PCarousel;
