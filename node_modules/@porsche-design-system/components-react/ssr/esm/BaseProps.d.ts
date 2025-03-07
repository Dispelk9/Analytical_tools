import type { DOMAttributes, HTMLAttributes } from 'react';
export type BaseProps = DOMAttributes<{}> & Pick<HTMLAttributes<{}>, 'suppressHydrationWarning' | 'autoFocus' | 'className' | 'dir' | 'hidden' | 'id' | 'inert' | 'lang' | 'slot' | 'style' | 'tabIndex' | 'title' | 'translate' | 'role'>;
