'use strict';

var jsxRuntime = require('react/jsx-runtime');
var required = require('./required.cjs');

const labelId = 'label';
const descriptionId = 'description';
const Label = ({ hasLabel, hasDescription, 
// host,
label, description, htmlFor, isRequired, isLoading, isDisabled,
// formElement,
 }) => {
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx("label", { className: "label", id: labelId, "aria-disabled": isLoading || isDisabled ? 'true' : null, ...(htmlFor
                    ? { htmlFor }
                    : {}), children: hasLabel && (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [label || jsxRuntime.jsx("slot", { name: "label" }), ((isRequired /* && !isParentFieldsetRequired(host) */) /* ||
                          (formElement && isRequiredAndParentNotRequired(// host, formElement)) */) && jsxRuntime.jsx(required.Required, {})] })) }), hasDescription && (jsxRuntime.jsx("span", { className: "label", id: descriptionId, "aria-disabled": isLoading || isDisabled ? 'true' : null, children: description || jsxRuntime.jsx("slot", { name: "description" }) }))] }));
};

exports.Label = Label;
exports.descriptionId = descriptionId;
exports.labelId = labelId;
