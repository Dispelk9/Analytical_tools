import { jsxs } from 'react/jsx-runtime';

const Required = () => {
    return (jsxs("span", { className: "required", "aria-hidden": "true", children: [' ', "*"] }));
};

export { Required };
