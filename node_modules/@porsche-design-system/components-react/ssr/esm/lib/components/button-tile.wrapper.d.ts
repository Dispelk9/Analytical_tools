import type { BaseProps } from '../../BaseProps';
import type { ButtonTileAlign, SelectedAriaAttributes, ButtonTileAriaAttribute, BreakpointCustomizable, ButtonTileAspectRatio, ButtonTileBackground, ButtonTileIcon, ButtonTileSize, ButtonTileType, ButtonTileWeight } from '../types';
export type PButtonTileProps = BaseProps & {
    /**
     * Alignment of button and description.
     */
    align?: ButtonTileAlign;
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<ButtonTileAriaAttribute>;
    /**
     * Aspect ratio of the button-tile.
     */
    aspectRatio?: BreakpointCustomizable<ButtonTileAspectRatio>;
    /**
     * Adapts the description and button theme when used on light background image.
     */
    background?: ButtonTileBackground;
    /**
     * Displays the button-tile as compact version with description and button icon only.
     */
    compact?: BreakpointCustomizable<boolean>;
    /**
     * Description text.
     */
    description: string;
    /**
     * Disables the button. No events will be triggered while disabled state is active.
     */
    disabled?: boolean;
    /**
     * Show gradient.
     */
    gradient?: boolean;
    /**
     * The icon shown. By choosing 'none', no icon is displayed.
     */
    icon?: ButtonTileIcon;
    /**
     * A URL path to a custom icon.
     */
    iconSource?: string;
    /**
     * Label of the button.
     */
    label: string;
    /**
     * Disables the button-tile and shows a loading indicator. No events will be triggered while loading state is active.
     */
    loading?: boolean;
    /**
     * Font size of the description.
     */
    size?: BreakpointCustomizable<ButtonTileSize>;
    /**
     * Specifies the type of the button.
     */
    type?: ButtonTileType;
    /**
     * Font weight of the description.
     */
    weight?: BreakpointCustomizable<ButtonTileWeight>;
};
export declare const PButtonTile: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Alignment of button and description.
     */
    align?: ButtonTileAlign;
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<ButtonTileAriaAttribute>;
    /**
     * Aspect ratio of the button-tile.
     */
    aspectRatio?: BreakpointCustomizable<ButtonTileAspectRatio>;
    /**
     * Adapts the description and button theme when used on light background image.
     */
    background?: ButtonTileBackground;
    /**
     * Displays the button-tile as compact version with description and button icon only.
     */
    compact?: BreakpointCustomizable<boolean>;
    /**
     * Description text.
     */
    description: string;
    /**
     * Disables the button. No events will be triggered while disabled state is active.
     */
    disabled?: boolean;
    /**
     * Show gradient.
     */
    gradient?: boolean;
    /**
     * The icon shown. By choosing 'none', no icon is displayed.
     */
    icon?: ButtonTileIcon;
    /**
     * A URL path to a custom icon.
     */
    iconSource?: string;
    /**
     * Label of the button.
     */
    label: string;
    /**
     * Disables the button-tile and shows a loading indicator. No events will be triggered while loading state is active.
     */
    loading?: boolean;
    /**
     * Font size of the description.
     */
    size?: BreakpointCustomizable<ButtonTileSize>;
    /**
     * Specifies the type of the button.
     */
    type?: ButtonTileType;
    /**
     * Font weight of the description.
     */
    weight?: BreakpointCustomizable<ButtonTileWeight>;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
