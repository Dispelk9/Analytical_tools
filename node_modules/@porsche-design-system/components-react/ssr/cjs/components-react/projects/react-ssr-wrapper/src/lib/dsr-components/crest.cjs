'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var minifyCss = require('../../minifyCss.cjs');
var stripFocusAndHoverStyles = require('../../stripFocusAndHoverStyles.cjs');
var stylesEntry = require('../../../../../../components/dist/styles/esm/styles-entry.cjs');
var utilsEntry = require('../../../../../../components/dist/utils/esm/utils-entry.cjs');

const { width, height } = utilsEntry.crestSize;
class DSRCrest extends react.Component {
    host;
    render() {
        const picture = (jsxRuntime.jsxs("picture", { children: [jsxRuntime.jsx("source", { srcSet: utilsEntry.buildCrestSrcSet('webp'), type: "image/webp" }, "webp"), jsxRuntime.jsx("source", { srcSet: utilsEntry.buildCrestSrcSet('png'), type: "image/png" }, "png"), jsxRuntime.jsx("img", { src: utilsEntry.buildCrestImgSrc(), width: width, height: height, alt: "Porsche" })] }));
        const style = minifyCss.minifyCss(stripFocusAndHoverStyles.stripFocusAndHoverStyles(stylesEntry.getCrestCss()));
        return (jsxRuntime.jsx(jsxRuntime.Fragment, { children: jsxRuntime.jsxs("template", { shadowroot: "open", shadowrootmode: "open", shadowrootdelegatesfocus: "true", children: [jsxRuntime.jsx("style", { dangerouslySetInnerHTML: { __html: style } }), jsxRuntime.jsx(jsxRuntime.Fragment, { children: this.props.href === undefined ? (picture) : (jsxRuntime.jsx("a", { href: this.props.href, target: this.props.target, ...utilsEntry.parseAndGetAriaAttributes(this.props.aria), children: picture })) })] }) }));
    }
}

exports.DSRCrest = DSRCrest;
