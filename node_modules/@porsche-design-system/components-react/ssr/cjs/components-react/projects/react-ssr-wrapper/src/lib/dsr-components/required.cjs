'use strict';

var jsxRuntime = require('react/jsx-runtime');

const Required = () => {
    return (jsxRuntime.jsxs("span", { className: "required", "aria-hidden": "true", children: [' ', "*"] }));
};

exports.Required = Required;
