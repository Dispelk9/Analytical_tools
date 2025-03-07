import { type Options } from '../../js/focus/getFocusStyle';
export declare const getFocusStyle: (opts?: Options) => {
    readonly selectors: {
        readonly '&:focus': {
            readonly outline: "2px solid #1A44EA";
            readonly outlineOffset: string | 0;
        };
        readonly '&:focus:not(:focus-visible)': {
            readonly outlineColor: "transparent";
        };
    };
    readonly borderRadius: string;
};
