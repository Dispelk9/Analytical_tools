import { type Theme } from '../../js';
type Options = {
    theme?: Exclude<Theme, 'auto'>;
};
export declare const skeletonKeyframes: {
    from: {
        backgroundPositionX: string;
    };
    to: {
        backgroundPositionX: string;
    };
};
/**
 * Generates skeleton loading styles with a background animation.
 *
 * @param {string} animationName - The name of the animation, which must be the generated name from `vanilla-extract`.
 * This should be the return value of the `keyframes` function.
 * @param {Options} [opts] - Optional configuration.
 * @param {Exclude<Theme, 'auto'>} [opts.theme='light'] - The theme to use, either 'light' or 'dark'.
 */
export declare const getSkeletonStyle: (animationName: string, opts?: Options) => {
    readonly display: "block";
    readonly background: "#EEEFF2 linear-gradient(to right, transparent 0%, #1a1b1e 25%, transparent 50%) 0 0 / 200% 100%" | "#EEEFF2 linear-gradient(to right, transparent 0%, #f7f7f7 25%, transparent 50%) 0 0 / 200% 100%" | "#212225 linear-gradient(to right, transparent 0%, #1a1b1e 25%, transparent 50%) 0 0 / 200% 100%" | "#212225 linear-gradient(to right, transparent 0%, #f7f7f7 25%, transparent 50%) 0 0 / 200% 100%";
    readonly borderRadius: "4px";
    readonly animation: `${string} 0.6s cubic-bezier(0.25,0.1,0.25,1) infinite`;
};
export {};
