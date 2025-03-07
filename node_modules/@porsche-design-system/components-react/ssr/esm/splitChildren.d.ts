import type { ReactElement, ReactNode } from 'react';
/**
 * @param children derived from PropsWithChildren
 *
 * type PropsWithChildren<P = unknown> = P & { children?: ReactNode | undefined };
 * type ReactNode = ReactElement | string | number | ReactFragment | ReactPortal | boolean | null | undefined;
 * interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
 *     type: T;
 *     props: P;
 *     key: Key | null;
 * }
 */
export declare const splitChildren: (children: ReactNode | undefined) => {
    children: any[];
    namedSlotChildren: ReactElement<HTMLSlotElement>[];
    otherChildren: any[];
};
