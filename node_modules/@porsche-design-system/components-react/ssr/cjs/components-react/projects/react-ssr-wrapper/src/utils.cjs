'use strict';

const splitToArray = (str) => str.split(' ').filter((str) => str);
const getMergedClassName = (domClassName, oldClassName = '', newClassName = '') => {
    // classes previously set by component
    const prevComponentClassNames = splitToArray(oldClassName);
    // all classes not set by component -> to keep hydrated class and other classes set on host element
    // (usually dom-manipulated class additions would be lost on rerender)
    let domClasses = splitToArray(domClassName);
    if (prevComponentClassNames.length) {
        domClasses = domClasses.filter((x) => !prevComponentClassNames.includes(x));
    }
    // all classes set by component
    const componentClasses = splitToArray(newClassName);
    return componentClasses.concat(domClasses).join(' ');
};
const syncRef = (elementRef, ref) => (el) => {
    elementRef.current = el;
    if (typeof ref === 'function') {
        ref(el);
    }
    else if (ref !== null) {
        ref.current = el;
    }
};
const skipPorscheDesignSystemCDNRequestsDuringTests = () => {
    window.PDS_SKIP_FETCH = true;
};

exports.getMergedClassName = getMergedClassName;
exports.skipPorscheDesignSystemCDNRequestsDuringTests = skipPorscheDesignSystemCDNRequestsDuringTests;
exports.syncRef = syncRef;
