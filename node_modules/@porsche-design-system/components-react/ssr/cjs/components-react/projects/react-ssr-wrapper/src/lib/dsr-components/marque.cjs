'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var minifyCss = require('../../minifyCss.cjs');
var stripFocusAndHoverStyles = require('../../stripFocusAndHoverStyles.cjs');
var stylesEntry = require('../../../../../../components/dist/styles/esm/styles-entry.cjs');
var utilsEntry = require('../../../../../../components/dist/utils/esm/utils-entry.cjs');

/** @deprecated since v3.0.0, will be removed with next major release. Please use "p-wordmark" instead. */
class DSRMarque extends react.Component {
    host;
    render() {
        const innerManifest = utilsEntry.getInnerManifest(this.props.variant, this.props.trademark);
        const mediumMedia = `(min-width: ${'1300'}px)`;
        const picture = (jsxRuntime.jsxs("picture", { children: [this.props.size === 'responsive'
                    ? [
                        jsxRuntime.jsx("source", { srcSet: utilsEntry.buildSrcSet(innerManifest, 'medium', 'webp'), media: mediumMedia, type: "image/webp" }, "medium-webp"),
                        jsxRuntime.jsx("source", { srcSet: utilsEntry.buildSrcSet(innerManifest, 'medium', 'png'), media: mediumMedia, type: "image/png" }, "medium-png"),
                        jsxRuntime.jsx("source", { srcSet: utilsEntry.buildSrcSet(innerManifest, 'small', 'webp'), type: "image/webp" }, "small-webp"),
                        jsxRuntime.jsx("source", { srcSet: utilsEntry.buildSrcSet(innerManifest, 'small', 'png'), type: "image/png" }, "small-png"),
                    ]
                    : [
                        jsxRuntime.jsx("source", { srcSet: utilsEntry.buildSrcSet(innerManifest, this.props.size, 'webp'), type: "image/webp" }, "webp"),
                        jsxRuntime.jsx("source", { srcSet: utilsEntry.buildSrcSet(innerManifest, this.props.size, 'png'), type: "image/png" }, "png"),
                    ], jsxRuntime.jsx("img", { src: utilsEntry.buildImgSrc(innerManifest), alt: "Porsche" })] }));
        const style = minifyCss.minifyCss(stripFocusAndHoverStyles.stripFocusAndHoverStyles(stylesEntry.getMarqueCss(this.props.size)));
        return (jsxRuntime.jsx(jsxRuntime.Fragment, { children: jsxRuntime.jsxs("template", { shadowroot: "open", shadowrootmode: "open", shadowrootdelegatesfocus: "true", children: [jsxRuntime.jsx("style", { dangerouslySetInnerHTML: { __html: style } }), jsxRuntime.jsx(jsxRuntime.Fragment, { children: this.props.href === undefined ? (picture) : (jsxRuntime.jsx("a", { href: this.props.href, target: this.props.target, ...utilsEntry.parseAndGetAriaAttributes(this.props.aria), children: picture })) })] }) }));
    }
}

exports.DSRMarque = DSRMarque;
