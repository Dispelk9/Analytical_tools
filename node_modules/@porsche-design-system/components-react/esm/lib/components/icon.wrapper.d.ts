import type { BaseProps } from '../../BaseProps';
import type { SelectedAriaAttributes, IconAriaAttribute, IconColor, IconName, IconSize, Theme } from '../types';
export type PIconProps = BaseProps & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<IconAriaAttribute>;
    /**
     * Basic color variations depending on theme property.
     */
    color?: IconColor;
    /**
     * Has no effect anymore (the component is now using the native `loading="lazy"` attribute by default)
     * @deprecated since v3.0.0, will be removed with next major release
     */
    lazy?: boolean;
    /**
     * Specifies which icon to use.
     */
    name?: IconName;
    /**
     * The size of the icon.
     */
    size?: IconSize;
    /**
     * Specifies a whole icon path which can be used for custom icons.
     */
    source?: string;
    /**
     * Adapts the color depending on the theme. Has no effect when "inherit" is set as color prop.
     */
    theme?: Theme;
};
export declare const PIcon: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * Add ARIA attributes.
     */
    aria?: SelectedAriaAttributes<IconAriaAttribute>;
    /**
     * Basic color variations depending on theme property.
     */
    color?: IconColor;
    /**
     * Has no effect anymore (the component is now using the native `loading="lazy"` attribute by default)
     * @deprecated since v3.0.0, will be removed with next major release
     */
    lazy?: boolean;
    /**
     * Specifies which icon to use.
     */
    name?: IconName;
    /**
     * The size of the icon.
     */
    size?: IconSize;
    /**
     * Specifies a whole icon path which can be used for custom icons.
     */
    source?: string;
    /**
     * Adapts the color depending on the theme. Has no effect when "inherit" is set as color prop.
     */
    theme?: Theme;
} & import("react").RefAttributes<HTMLElement>>;
