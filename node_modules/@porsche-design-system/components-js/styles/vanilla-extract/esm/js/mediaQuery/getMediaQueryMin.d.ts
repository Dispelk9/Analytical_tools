import type { BKey } from './mediaQueryShared';
export declare function getMediaQueryMin(min: BKey<'base'>): '@media(min-width:0px)';
export declare function getMediaQueryMin(min: BKey<'xs'>): '@media(min-width:480px)';
export declare function getMediaQueryMin(min: BKey<'s'>): '@media(min-width:760px)';
export declare function getMediaQueryMin(min: BKey<'m'>): '@media(min-width:1000px)';
export declare function getMediaQueryMin(min: BKey<'l'>): '@media(min-width:1300px)';
export declare function getMediaQueryMin(min: BKey<'xl'>): '@media(min-width:1760px)';
export declare function getMediaQueryMin(min: BKey<'xxl'>): '@media(min-width:1920px)';
