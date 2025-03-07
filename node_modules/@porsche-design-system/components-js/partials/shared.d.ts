export type Cdn = 'auto' | 'cn';
export type Format = 'html' | 'jsx';
export type FormatWithJS = 'html' | 'jsx' | 'js';
export type FormatWithCSP = Format | 'sha256';
export declare const throwIfRunInBrowser: (partialName: string) => void;
export declare const getSha256Hash: (content: string) => string;
