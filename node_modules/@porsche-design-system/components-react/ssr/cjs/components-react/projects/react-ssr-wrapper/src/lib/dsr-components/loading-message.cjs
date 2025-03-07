'use strict';

var jsxRuntime = require('react/jsx-runtime');

const loadingId = 'loading';
const LoadingMessage = ({ loading, initialLoading }) => {
    return (jsxRuntime.jsx("span", { id: loadingId, className: "loading", role: "status", children: loading ? 'Loading' : initialLoading ? 'Loading finished' : '' }));
};

exports.LoadingMessage = LoadingMessage;
exports.loadingId = loadingId;
