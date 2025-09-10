import { type ChatBskyActorDefs, ChatBskyConvoDefs, type ChatBskyConvoGetLog, type ChatBskyConvoSendMessage } from '@atproto/api';
import { type ConvoDispatch, type ConvoEvent, type ConvoItem, type ConvoParams, type ConvoState } from '#/state/messages/convo/types';
import { type MessagesEventBusError } from '#/state/messages/events/types';
export declare function isConvoItemMessage(item: ConvoItem): item is ConvoItem & {
    type: 'message';
};
export declare class Convo {
    private id;
    private agent;
    private events;
    private senderUserDid;
    private status;
    private error;
    private oldestRev;
    private isFetchingHistory;
    private latestRev;
    private pastMessages;
    private newMessages;
    private pendingMessages;
    private deletedMessages;
    private isProcessingPendingMessages;
    private lastActiveTimestamp;
    private emitter;
    convoId: string;
    convo: ChatBskyConvoDefs.ConvoView | undefined;
    sender: ChatBskyActorDefs.ProfileViewBasic | undefined;
    recipients: ChatBskyActorDefs.ProfileViewBasic[] | undefined;
    snapshot: ConvoState | undefined;
    constructor(params: ConvoParams);
    private commit;
    private subscribers;
    subscribe(subscriber: () => void): () => void;
    getSnapshot(): ConvoState;
    private generateSnapshot;
    dispatch(action: ConvoDispatch): void;
    private reset;
    maybeRecoverFromNetworkError(): void;
    /**
     * Initialises the convo with placeholder data, if provided. We still refetch it before rendering the convo,
     * but this allows us to render the convo header immediately.
     */
    private setupPlaceholderData;
    private setup;
    init(): void;
    resume(): void;
    background(): void;
    suspend(): void;
    /**
     * Called on any state transition, like when the chat is backgrounded. This
     * value is then checked on background -> foreground transitions.
     */
    private updateLastActiveTimestamp;
    private wasChatInactive;
    private requestedPollInterval;
    private requestPollInterval;
    private withdrawRequestedPollInterval;
    private pendingFetchConvo;
    fetchConvo(): Promise<{
        convo: ChatBskyConvoDefs.ConvoView;
        sender: ChatBskyActorDefs.ProfileViewBasic | undefined;
        recipients: ChatBskyActorDefs.ProfileViewBasic[];
    }>;
    refreshConvo(): Promise<void>;
    private fetchMessageHistoryError;
    fetchMessageHistory(): Promise<void>;
    private cleanupFirehoseConnection;
    private setupFirehose;
    private firehoseError;
    onFirehoseConnect(): void;
    onFirehoseError(error?: MessagesEventBusError): void;
    ingestFirehose(events: ChatBskyConvoGetLog.OutputSchema['logs']): void;
    private pendingMessageFailure;
    sendMessage(message: ChatBskyConvoSendMessage.InputSchema['message']): void;
    markConvoAccepted(): void;
    processPendingMessages(): Promise<void>;
    private handleSendMessageFailure;
    batchRetryPendingMessages(): Promise<void>;
    deleteMessage(messageId: string): Promise<void>;
    on(handler: (event: ConvoEvent) => void): () => void;
    getItems(): ConvoItem[];
    /**
     * Add an emoji reaction to a message
     *
     * @param messageId - the id of the message to add the reaction to
     * @param emoji - must be one grapheme
     */
    addReaction(messageId: string, emoji: string): Promise<void>;
    removeReaction(messageId: string, emoji: string): Promise<void>;
}
//# sourceMappingURL=agent.d.ts.map