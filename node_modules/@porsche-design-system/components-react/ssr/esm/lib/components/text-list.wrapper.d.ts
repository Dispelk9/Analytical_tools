import type { BaseProps } from '../../BaseProps';
import type { TextListListType, TextListOrderType, Theme, TextListType } from '../types';
export type PTextListProps = BaseProps & {
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `type` instead. The type of the list.
     */
    listType?: TextListListType;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `type` instead. The list style type of ordered list. Only has effect when list type is set to 'ordered'.
     */
    orderType?: TextListOrderType;
    /**
     * Adapts the text color depending on the theme.
     */
    theme?: Theme;
    /**
     * The list style type.
     */
    type?: TextListType;
};
export declare const PTextList: import("react").ForwardRefExoticComponent<import("react").DOMAttributes<{}> & Pick<import("react").HTMLAttributes<{}>, "suppressHydrationWarning" | "autoFocus" | "className" | "dir" | "hidden" | "id" | "inert" | "lang" | "slot" | "style" | "tabIndex" | "title" | "translate" | "role"> & {
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `type` instead. The type of the list.
     */
    listType?: TextListListType;
    /**
     * @deprecated since v3.0.0, will be removed with next major release, use `type` instead. The list style type of ordered list. Only has effect when list type is set to 'ordered'.
     */
    orderType?: TextListOrderType;
    /**
     * Adapts the text color depending on the theme.
     */
    theme?: Theme;
    /**
     * The list style type.
     */
    type?: TextListType;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLElement>>;
