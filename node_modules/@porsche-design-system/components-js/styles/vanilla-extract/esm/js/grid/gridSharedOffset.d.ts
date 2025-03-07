type GridWidth = 'narrow' | 'basic' | 'extended' | 'wide' | 'full';
export declare const _gridPadding = "max(0px, 50vw - 2560px / 2)";
export declare const _getGridOffsetS: (width: Exclude<GridWidth, "full" | "wide">) => string;
export declare const _getGridOffsetXXL: (width: Exclude<GridWidth, "full" | "wide">) => string;
export {};
