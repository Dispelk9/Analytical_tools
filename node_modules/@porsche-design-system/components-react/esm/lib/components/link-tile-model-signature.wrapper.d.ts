import type { BaseProps } from '../../BaseProps';
import type { BreakpointCustomizable, LinkTileModelSignatureAspectRatio, LinkTileModelSignatureHeadingTag, LinkTileModelSignatureLinkDirection, LinkTileModelSignatureModel, LinkTileModelSignatureWeight } from '../types';
export type PLinkTileModelSignatureProps = BaseProps & {
    /**
     * Aspect ratio of the link-tile-model-signature.
     */
    aspectRatio?: BreakpointCustomizable<LinkTileModelSignatureAspectRatio>;
    /**
     * Description text.
     */
    description?: string;
    /**
     * Heading text.
     */
    heading: string;
    /**
     * Sets a heading tag, so it fits correctly within the outline of the page.
     */
    headingTag?: LinkTileModelSignatureHeadingTag;
    /**
     * Defines the direction of the main and cross axis of the links. The default is '{base: ‘column’, xs: ‘row’}' showing buttons vertically stacked on mobile viewports and side-by-side in a horizontal row from breakpoint 'xs'.
     */
    linkDirection?: BreakpointCustomizable<LinkTileModelSignatureLinkDirection>;
    /**
     * Adapts the model of the component.
     */
    model?: LinkTileModelSignatureModel;
    /**
     * Adapts the font weight of the heading.
     */
    weight?: BreakpointCustomizable<LinkTileModelSignatureWeight>;
};
export declare const PLinkTileModelSignature: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Aspect ratio of the link-tile-model-signature.
     */
    aspectRatio?: BreakpointCustomizable<LinkTileModelSignatureAspectRatio>;
    /**
     * Description text.
     */
    description?: string;
    /**
     * Heading text.
     */
    heading: string;
    /**
     * Sets a heading tag, so it fits correctly within the outline of the page.
     */
    headingTag?: LinkTileModelSignatureHeadingTag;
    /**
     * Defines the direction of the main and cross axis of the links. The default is '{base: ‘column’, xs: ‘row’}' showing buttons vertically stacked on mobile viewports and side-by-side in a horizontal row from breakpoint 'xs'.
     */
    linkDirection?: BreakpointCustomizable<LinkTileModelSignatureLinkDirection>;
    /**
     * Adapts the model of the component.
     */
    model?: LinkTileModelSignatureModel;
    /**
     * Adapts the font weight of the heading.
     */
    weight?: BreakpointCustomizable<LinkTileModelSignatureWeight>;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
