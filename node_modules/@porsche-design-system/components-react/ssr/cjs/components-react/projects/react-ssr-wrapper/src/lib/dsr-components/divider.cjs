'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var minifyCss = require('../../minifyCss.cjs');
var stripFocusAndHoverStyles = require('../../stripFocusAndHoverStyles.cjs');
var stylesEntry = require('../../../../../../components/dist/styles/esm/styles-entry.cjs');

class DSRDivider extends react.Component {
    host;
    render() {
        const deprecationMap = {
            'neutral-contrast-low': 'contrast-low',
            'neutral-contrast-medium': 'contrast-medium',
            'neutral-contrast-high': 'contrast-high',
        };
        const style = minifyCss.minifyCss(stripFocusAndHoverStyles.stripFocusAndHoverStyles(stylesEntry.getDividerCss((deprecationMap[this.props.color] || this.props.color), this.props.orientation || this.props.direction, this.props.theme)));
        return (jsxRuntime.jsx(jsxRuntime.Fragment, { children: jsxRuntime.jsxs("template", { shadowroot: "open", shadowrootmode: "open", children: [jsxRuntime.jsx("style", { dangerouslySetInnerHTML: { __html: style } }), jsxRuntime.jsx("hr", {})] }) }));
    }
}

exports.DSRDivider = DSRDivider;
