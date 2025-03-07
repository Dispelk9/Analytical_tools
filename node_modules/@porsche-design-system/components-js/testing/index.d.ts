import type { GetByRole, GetByText } from '@testing-library/dom';
type RemoveFirst<T extends any[]> = T['length'] extends 0 ? undefined : ((...b: T) => void) extends (a: any, ...b: infer I) => void ? I : [];
export declare function getByRoleShadowed<T extends HTMLElement>(...args: Parameters<GetByRole<T>>): T;
export declare function getByRoleShadowed<T extends HTMLElement>(...args: RemoveFirst<Parameters<GetByRole<T>>>): T;
export declare function getByLabelTextShadowed<T extends HTMLElement>(...args: Parameters<GetByText<T>>): T;
export declare function getByLabelTextShadowed<T extends HTMLElement>(...args: RemoveFirst<Parameters<GetByText<T>>>): T;
export declare function getByTextShadowed<T extends HTMLElement>(...args: Parameters<GetByText<T>>): T;
export declare function getByTextShadowed<T extends HTMLElement>(...args: RemoveFirst<Parameters<GetByText<T>>>): T;
export {};
