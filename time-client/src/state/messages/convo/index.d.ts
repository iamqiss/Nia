import React from 'react';
import { type ConvoParams } from '#/state/messages/convo/types';
export * from '#/state/messages/convo/util';
export declare function useConvo(): any;
/**
 * This hook should only be used when the Convo is "active", meaning the chat
 * is loaded and ready to be used, or its in a suspended or background state,
 * and ready for resumption.
 */
export declare function useConvoActive(): any;
export declare function ConvoProvider({ children, convoId, }: Pick<ConvoParams, 'convoId'> & {
    children: React.ReactNode;
}): any;
//# sourceMappingURL=index.d.ts.map