import { type ChatBskyConvoLeaveConvo } from '@atproto/api';
export declare function RQKEY(convoId: string | undefined): (string | undefined)[];
export declare function useLeaveConvo(convoId: string | undefined, { onSuccess, onMutate, onError, }: {
    onMutate?: () => void;
    onSuccess?: (data: ChatBskyConvoLeaveConvo.OutputSchema) => void;
    onError?: (error: Error) => void;
}): any;
/**
 * Gets currently pending and successful leave convo mutations
 *
 * @returns Array of `convoId`
 */
export declare function useLeftConvos(): any;
//# sourceMappingURL=leave-conversation.d.ts.map