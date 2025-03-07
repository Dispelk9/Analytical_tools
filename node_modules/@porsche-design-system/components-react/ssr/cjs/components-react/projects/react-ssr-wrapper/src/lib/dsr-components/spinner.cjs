'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var minifyCss = require('../../minifyCss.cjs');
var stripFocusAndHoverStyles = require('../../stripFocusAndHoverStyles.cjs');
var stylesEntry = require('../../../../../../components/dist/styles/esm/styles-entry.cjs');
var utilsEntry = require('../../../../../../components/dist/utils/esm/utils-entry.cjs');

class DSRSpinner extends react.Component {
    host;
    render() {
        const style = minifyCss.minifyCss(stripFocusAndHoverStyles.stripFocusAndHoverStyles(stylesEntry.getSpinnerCss(this.props.size, this.props.theme)));
        return (jsxRuntime.jsx(jsxRuntime.Fragment, { children: jsxRuntime.jsxs("template", { shadowroot: "open", shadowrootmode: "open", children: [jsxRuntime.jsx("style", { dangerouslySetInnerHTML: { __html: style } }), jsxRuntime.jsxs("span", { className: "root", role: "alert", "aria-live": "assertive", ...utilsEntry.parseAndGetAriaAttributes(this.props.aria), children: [jsxRuntime.jsx("span", { className: "sr-only", children: "\u00A0" }), jsxRuntime.jsxs("svg", { viewBox: "-16 -16 32 32", width: "100%", height: "100%", focusable: "false", "aria-hidden": "true", children: [jsxRuntime.jsx("circle", { r: "9" }), jsxRuntime.jsx("circle", { r: "9" })] })] })] }) }));
    }
}

exports.DSRSpinner = DSRSpinner;
