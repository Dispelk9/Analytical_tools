'use strict';

var dom = require('@testing-library/dom');

const getHTMLElementsWithShadowRoot = (container) => {
    return Array.from(container.querySelectorAll('*')).filter((el) => !!el.shadowRoot);
};
const isParamContainer = (param) => typeof param.querySelector === 'function' && typeof param.querySelectorAll === 'function';
const shadowFactory = (getByFunc, selfFunc) => (container, idOrRole, options) => {
    let resultElement;
    if (!isParamContainer(container)) {
        // rewire parameters
        options = idOrRole;
        idOrRole = container;
        container = document.body; // body as fallback
    }
    try {
        resultElement = getByFunc(container, idOrRole, options);
    }
    catch (e) {
        const elements = getHTMLElementsWithShadowRoot(container);
        for (const el of elements) {
            resultElement = selfFunc(el.shadowRoot, idOrRole, options);
            if (resultElement) {
                break;
            }
        }
    }
    return resultElement;
};
function getByRoleShadowed(...args) {
    // @ts-ignore
    return shadowFactory(dom.getByRole, getByRoleShadowed)(...args);
}
function getByLabelTextShadowed(...args) {
    // @ts-ignore
    return shadowFactory(dom.getByLabelText, getByLabelTextShadowed)(...args);
}
function getByTextShadowed(...args) {
    // @ts-ignore
    return shadowFactory(dom.getByText, getByTextShadowed)(...args);
}

exports.getByLabelTextShadowed = getByLabelTextShadowed;
exports.getByRoleShadowed = getByRoleShadowed;
exports.getByTextShadowed = getByTextShadowed;
