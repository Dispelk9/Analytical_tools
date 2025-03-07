import type { BaseProps } from '../../BaseProps';
import type { LinkTileAlign, SelectedAriaAttributes, LinkTileAriaAttribute, BreakpointCustomizable, LinkTileAspectRatio, LinkTileBackground, LinkTileSize, LinkTileTarget, LinkTileWeight } from '../types';
export type PLinkTileProps = BaseProps & {
    /**
     * Alignment of link and description.
     */
    align?: LinkTileAlign;
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<LinkTileAriaAttribute>;
    /**
     * Aspect ratio of the link-tile.
     */
    aspectRatio?: BreakpointCustomizable<LinkTileAspectRatio>;
    /**
     * Adapts the description and link theme when used on light background image.
     */
    background?: LinkTileBackground;
    /**
     * Displays the link-tile as compact version with description and link icon only.
     */
    compact?: BreakpointCustomizable<boolean>;
    /**
     * Description text.
     */
    description: string;
    /**
     * Special download attribute to open native browser download dialog if target url points to a downloadable file.
     */
    download?: string;
    /**
     * Show gradient.
     */
    gradient?: boolean;
    /**
     * href of the `<a>`.
     */
    href: string;
    /**
     * Label of the <a />.
     */
    label: string;
    /**
     * Specifies the relationship of the target object to the link object.
     */
    rel?: string;
    /**
     * Font size of the description.
     */
    size?: BreakpointCustomizable<LinkTileSize>;
    /**
     * Target attribute where the link should be opened.
     */
    target?: LinkTileTarget;
    /**
     * Font weight of the description.
     */
    weight?: BreakpointCustomizable<LinkTileWeight>;
};
export declare const PLinkTile: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Alignment of link and description.
     */
    align?: LinkTileAlign;
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<LinkTileAriaAttribute>;
    /**
     * Aspect ratio of the link-tile.
     */
    aspectRatio?: BreakpointCustomizable<LinkTileAspectRatio>;
    /**
     * Adapts the description and link theme when used on light background image.
     */
    background?: LinkTileBackground;
    /**
     * Displays the link-tile as compact version with description and link icon only.
     */
    compact?: BreakpointCustomizable<boolean>;
    /**
     * Description text.
     */
    description: string;
    /**
     * Special download attribute to open native browser download dialog if target url points to a downloadable file.
     */
    download?: string;
    /**
     * Show gradient.
     */
    gradient?: boolean;
    /**
     * href of the `<a>`.
     */
    href: string;
    /**
     * Label of the <a />.
     */
    label: string;
    /**
     * Specifies the relationship of the target object to the link object.
     */
    rel?: string;
    /**
     * Font size of the description.
     */
    size?: BreakpointCustomizable<LinkTileSize>;
    /**
     * Target attribute where the link should be opened.
     */
    target?: LinkTileTarget;
    /**
     * Font weight of the description.
     */
    weight?: BreakpointCustomizable<LinkTileWeight>;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
