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
    react.useEffect(() => {
        componentsJs.load({ prefix, cdn });
    }, []); // runtime prefix or cdn change is not supported
    return jsxRuntime.jsx(PorscheDesignSystemContext.Provider, { value: { prefix, theme }, ...props });
};

exports.PorscheDesignSystemContext = PorscheDesignSystemContext;
exports.PorscheDesignSystemProvider = PorscheDesignSystemProvider;
