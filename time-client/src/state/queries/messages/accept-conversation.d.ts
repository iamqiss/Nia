import { type ChatBskyConvoAcceptConvo } from '@atproto/api';
export declare function useAcceptConversation(convoId: string, { onSuccess, onMutate, onError, }: {
    onMutate?: () => void;
    onSuccess?: (data: ChatBskyConvoAcceptConvo.OutputSchema) => void;
    onError?: (error: Error) => void;
}): any;
//# sourceMappingURL=accept-conversation.d.ts.map