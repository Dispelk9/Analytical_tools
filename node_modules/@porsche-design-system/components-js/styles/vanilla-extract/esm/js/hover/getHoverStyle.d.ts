type BorderRadius = 'small' | 'medium';
export type Options = {
    borderRadius?: BorderRadius | string;
};
export declare const getHoverStyles: (borderRadius?: Options["borderRadius"]) => {
    borderRadius: string;
    marginLeft: string;
    marginRight: string;
    paddingLeft: string;
    paddingRight: string;
    transition: string;
};
export declare const getHoverNestedStyles: () => {
    background: string;
};
export declare const getHoverStyle: (opts?: Options) => {
    readonly '@media(hover:hover)': {
        readonly '&:hover': {
            readonly background: string;
        };
    };
    readonly borderRadius: string;
    readonly marginLeft: string;
    readonly marginRight: string;
    readonly paddingLeft: string;
    readonly paddingRight: string;
    readonly transition: string;
};
export {};
