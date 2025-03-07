"use client";
'use strict';

var react = require('react');
var provider = require('./provider.cjs');
var utils = require('./utils.cjs');

let skipCheck = false;
/**
 * sets a flag that skips the need for `PorscheDesignSystemProvider` during testing
 * when `process.env.NODE_ENV === 'test'`
 */
const skipCheckForPorscheDesignSystemProviderDuringTests = () => {
    skipCheck = true;
};
const usePrefix = (tagName) => {
    if (process.env.NODE_ENV === 'test' && skipCheck) {
        return tagName;
    }
    else {
        const { prefix } = react.useContext(provider.PorscheDesignSystemContext); // eslint-disable-line react-hooks/rules-of-hooks
        if (prefix === undefined) {
            throw new Error('It appears the <PorscheDesignSystemProvider /> is missing. Make sure to wrap your App in it.');
        }
        return prefix ? prefix + '-' + tagName : tagName;
    }
};
const useTheme = () => {
    if (process.env.NODE_ENV === 'test' && skipCheck) {
        return 'light';
    }
    else {
        return react.useContext(provider.PorscheDesignSystemContext).theme; // eslint-disable-line react-hooks/rules-of-hooks
    }
};
const useEventCallback = (ref, eventName, eventHandler) => {
    // @ts-expect-error
    react.useEffect(() => {
        const { current } = ref;
        if (current && eventHandler) {
            current.addEventListener(eventName, eventHandler);
            return () => current?.removeEventListener(eventName, eventHandler);
        }
    }, [eventHandler]); // eslint-disable-line react-hooks/exhaustive-deps
};
const useMergedClass = (ref, className) => {
    const prevComponentClassName = react.useRef(undefined);
    return react.useMemo(() => {
        if (!className) {
            return undefined;
        }
        const { current } = ref;
        let newClassName = className;
        if (current) {
            newClassName = utils.getMergedClassName(current.className, prevComponentClassName.current, className);
            // the jsx does not override className when the attribute changes
            current.className = newClassName;
        }
        prevComponentClassName.current = className;
        return newClassName;
    }, [className]); // eslint-disable-line react-hooks/exhaustive-deps
};
const useBrowserLayoutEffect = typeof window !== 'undefined' ? react.useLayoutEffect : react.useEffect;
const useToastManager = () => {
    const tagName = usePrefix('p-toast');
    return {
        addMessage: (message) => {
            const toast = document.body.querySelector(tagName);
            customElements.whenDefined(tagName).then(() => toast.addMessage(message));
        },
    };
};

exports.skipCheckForPorscheDesignSystemProviderDuringTests = skipCheckForPorscheDesignSystemProviderDuringTests;
exports.useBrowserLayoutEffect = useBrowserLayoutEffect;
exports.useEventCallback = useEventCallback;
exports.useMergedClass = useMergedClass;
exports.usePrefix = usePrefix;
exports.useTheme = useTheme;
exports.useToastManager = useToastManager;
