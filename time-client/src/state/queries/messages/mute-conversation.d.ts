import { type ChatBskyConvoMuteConvo } from '@atproto/api';
export declare function useMuteConvo(convoId: string | undefined, { onSuccess, onError, }: {
    onSuccess?: (data: ChatBskyConvoMuteConvo.OutputSchema) => void;
    onError?: (error: Error) => void;
}): any;
//# sourceMappingURL=mute-conversation.d.ts.map