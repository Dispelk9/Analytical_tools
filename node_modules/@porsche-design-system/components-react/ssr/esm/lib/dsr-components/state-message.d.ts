import type { FC } from 'react';
type StateMessageProps = {
    hasMessage: boolean;
    state: any;
    message: string;
    theme: any;
    host: HTMLElement;
};
export declare const messageId = "message";
export declare const StateMessage: FC<StateMessageProps>;
export {};
