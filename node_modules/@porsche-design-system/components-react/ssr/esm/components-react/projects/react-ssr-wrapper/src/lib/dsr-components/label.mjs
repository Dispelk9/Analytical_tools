import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { Required } from './required.mjs';

const labelId = 'label';
const descriptionId = 'description';
const Label = ({ hasLabel, hasDescription, 
// host,
label, description, htmlFor, isRequired, isLoading, isDisabled,
// formElement,
 }) => {
    return (jsxs(Fragment, { children: [jsx("label", { className: "label", id: labelId, "aria-disabled": isLoading || isDisabled ? 'true' : null, ...(htmlFor
                    ? { htmlFor }
                    : {}), children: hasLabel && (jsxs(Fragment, { children: [label || jsx("slot", { name: "label" }), ((isRequired /* && !isParentFieldsetRequired(host) */) /* ||
                          (formElement && isRequiredAndParentNotRequired(// host, formElement)) */) && jsx(Required, {})] })) }), hasDescription && (jsx("span", { className: "label", id: descriptionId, "aria-disabled": isLoading || isDisabled ? 'true' : null, children: description || jsx("slot", { name: "description" }) }))] }));
};

export { Label, descriptionId, labelId };
