export declare const gridStyle: {
    readonly "--pds-internal-grid-safe-zone": "max(22px, 10.625vw - 12px)";
    readonly "--pds-grid-extended-span-one-half": string;
    readonly "--pds-grid-basic-span-one-half": string;
    readonly "--pds-grid-basic-span-one-third": string;
    readonly "--pds-grid-basic-span-two-thirds": string;
    readonly "--pds-grid-narrow-span-one-half": string;
    readonly display: "grid";
    readonly gridGap: "clamp(16px, 1.25vw + 12px, 36px)";
    readonly gridTemplateColumns: string;
    readonly minWidth: "var(--pds-internal-grid-width-min,320px)";
    readonly maxWidth: "var(--pds-internal-grid-width-max,2560px)";
    readonly margin: "0 var(--pds-internal-grid-margin,0)";
    readonly padding: "0 calc(50% - var(--pds-internal-grid-margin,0px) - 2560px / 2)";
    readonly boxSizing: "content-box";
    readonly "@media(min-width:760px)": {
        readonly "--pds-internal-grid-safe-zone": "calc(5vw - 16px)";
        readonly "--pds-grid-extended-span-one-half": string;
        readonly "--pds-grid-basic-span-one-half": string;
        readonly "--pds-grid-basic-span-one-third": string;
        readonly "--pds-grid-basic-span-two-thirds": string;
        readonly "--pds-grid-narrow-span-one-half": string;
        readonly gridTemplateColumns: string;
    };
    readonly "@media(min-width:1920px)": {
        readonly "--pds-internal-grid-safe-zone": "min(50vw - 880px, 400px)";
    };
};
