import { type Theme } from '../theme';
type Options = {
    theme?: Exclude<Theme, 'auto'>;
};
export declare const getSkeletonStyle: (opts?: Options) => {
    readonly display: "block";
    readonly background: "#EEEFF2 linear-gradient(to right, transparent 0%, #1a1b1e 25%, transparent 50%) 0 0 / 200% 100%" | "#EEEFF2 linear-gradient(to right, transparent 0%, #f7f7f7 25%, transparent 50%) 0 0 / 200% 100%" | "#212225 linear-gradient(to right, transparent 0%, #1a1b1e 25%, transparent 50%) 0 0 / 200% 100%" | "#212225 linear-gradient(to right, transparent 0%, #f7f7f7 25%, transparent 50%) 0 0 / 200% 100%";
    readonly borderRadius: "4px";
    readonly animation: "skeletonAnimation 0.6s cubic-bezier(0.25,0.1,0.25,1) infinite";
    readonly '@keyframes skeletonAnimation': {
        readonly from: {
            readonly backgroundPositionX: "100%";
        };
        readonly to: {
            readonly backgroundPositionX: "-100%";
        };
    };
};
export {};
