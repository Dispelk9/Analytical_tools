"use client";
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var componentsJs = require('@porsche-design-system/components-js');

// to warn users about missing PorscheDesignSystemProvider, we set the default values as undefined
const PorscheDesignSystemContext = react.createContext({
    prefix: undefined,
    theme: 'light',
});
const PorscheDesignSystemProvider = ({ prefix = '', cdn, theme = 'light', ...props }) => {
    // @ts-ignore
    if (!process.browser) {
        // for ssr we set the global PORSCHE_DESIGN_SYSTEM_CDN_URL variable that is used in our getCDNBaseURL() util to respect the cdn
        const tld = cdn === 'cn' ? 'cn' : 'com';
        // @ts-ignore
        global.PORSCHE_DESIGN_SYSTEM_CDN_URL = `https://cdn.ui.porsche.${tld}`;
    }
    react.useEffect(() => {
        componentsJs.load({ prefix, cdn });
    }, []); // runtime prefix or cdn change is not supported
    return jsxRuntime.jsx(PorscheDesignSystemContext.Provider, { value: { prefix, theme }, ...props });
};

exports.PorscheDesignSystemContext = PorscheDesignSystemContext;
exports.PorscheDesignSystemProvider = PorscheDesignSystemProvider;
