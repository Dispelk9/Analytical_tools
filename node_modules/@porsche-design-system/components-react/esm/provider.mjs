"use client";
import { jsx } from 'react/jsx-runtime';
import { createContext, useEffect } from 'react';
import { load } from '@porsche-design-system/components-js';

// to warn users about missing PorscheDesignSystemProvider, we set the default values as undefined
const PorscheDesignSystemContext = createContext({
    prefix: undefined,
    theme: 'light',
});
const PorscheDesignSystemProvider = ({ prefix = '', cdn, theme = 'light', ...props }) => {
    useEffect(() => {
        load({ prefix, cdn });
    }, []); // runtime prefix or cdn change is not supported
    return jsx(PorscheDesignSystemContext.Provider, { value: { prefix, theme }, ...props });
};

export { PorscheDesignSystemContext, PorscheDesignSystemProvider };
