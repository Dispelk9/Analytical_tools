import type { BaseProps } from '../../BaseProps';
import type { BreakpointCustomizable, LinkTileProductAspectRatio, LinkTileProductLikeEventDetail, LinkTileProductTarget, Theme } from '../types';
export type PLinkTileProductProps = BaseProps & {
    /**
     * Aspect ratio of the link-tile-product.
     */
    aspectRatio?: BreakpointCustomizable<LinkTileProductAspectRatio>;
    /**
     * Additional product description.
     */
    description?: string;
    /**
     * Product heading.
     */
    heading: string;
    /**
     * href of the `<a>`.
     */
    href?: string;
    /**
     * A Boolean attribute indicating that a like button should be shown.
     */
    likeButton?: boolean;
    /**
     * A Boolean attribute indicating that a product is liked.
     */
    liked?: boolean;
    /**
     * Emitted when the like button is clicked.
     */
    onLike?: (event: CustomEvent<LinkTileProductLikeEventDetail>) => void;
    /**
     * Product retail price (with or without discount).
     */
    price: string;
    /**
     * Shows original price (recommended retail price) with line-through. Needs prop "price" to be defined, otherwise this prop has no effect.
     */
    priceOriginal?: string;
    /**
     * Specifies the relationship of the target object to the link object.
     */
    rel?: string;
    /**
     * Target attribute where the link should be opened.
     */
    target?: LinkTileProductTarget;
    /**
     * Adapts the link-tile-product color depending on the theme.
     */
    theme?: Theme;
};
export declare const PLinkTileProduct: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Aspect ratio of the link-tile-product.
     */
    aspectRatio?: BreakpointCustomizable<LinkTileProductAspectRatio>;
    /**
     * Additional product description.
     */
    description?: string;
    /**
     * Product heading.
     */
    heading: string;
    /**
     * href of the `<a>`.
     */
    href?: string;
    /**
     * A Boolean attribute indicating that a like button should be shown.
     */
    likeButton?: boolean;
    /**
     * A Boolean attribute indicating that a product is liked.
     */
    liked?: boolean;
    /**
     * Emitted when the like button is clicked.
     */
    onLike?: (event: CustomEvent<LinkTileProductLikeEventDetail>) => void;
    /**
     * Product retail price (with or without discount).
     */
    price: string;
    /**
     * Shows original price (recommended retail price) with line-through. Needs prop "price" to be defined, otherwise this prop has no effect.
     */
    priceOriginal?: string;
    /**
     * Specifies the relationship of the target object to the link object.
     */
    rel?: string;
    /**
     * Target attribute where the link should be opened.
     */
    target?: LinkTileProductTarget;
    /**
     * Adapts the link-tile-product color depending on the theme.
     */
    theme?: Theme;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
