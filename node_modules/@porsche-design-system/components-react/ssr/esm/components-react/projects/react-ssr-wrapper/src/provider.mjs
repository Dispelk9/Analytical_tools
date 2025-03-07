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
    // @ts-ignore
    if (!process.browser) {
        // for ssr we set the global PORSCHE_DESIGN_SYSTEM_CDN_URL variable that is used in our getCDNBaseURL() util to respect the cdn
        const tld = cdn === 'cn' ? 'cn' : 'com';
        // @ts-ignore
        global.PORSCHE_DESIGN_SYSTEM_CDN_URL = `https://cdn.ui.porsche.${tld}`;
    }
    useEffect(() => {
        load({ prefix, cdn });
    }, []); // runtime prefix or cdn change is not supported
    return jsx(PorscheDesignSystemContext.Provider, { value: { prefix, theme }, ...props });
};

export { PorscheDesignSystemContext, PorscheDesignSystemProvider };
