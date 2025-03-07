import { type Options } from '../../js/hover/getHoverStyle';
export declare const getHoverStyle: (opts?: Options) => {
    readonly '@media': {
        readonly '(hover:hover)': {
            readonly selectors: {
                readonly '&:hover': {
                    readonly background: string;
                };
            };
        };
    };
    readonly borderRadius: string;
    readonly marginLeft: string;
    readonly marginRight: string;
    readonly paddingLeft: string;
    readonly paddingRight: string;
    readonly transition: string;
};
