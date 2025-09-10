import { type MessagesEventBusEvent, type MessagesEventBusParams } from '#/state/messages/events/types';
export declare class MessagesEventBus {
    private id;
    private agent;
    private emitter;
    private status;
    private latestRev;
    private pollInterval;
    private requestedPollIntervals;
    constructor(params: MessagesEventBusParams);
    requestPollInterval(interval: number): () => void;
    getLatestRev(): string | undefined;
    on(handler: (event: MessagesEventBusEvent) => void, options: {
        convoId?: string;
    }): () => void;
    background(): void;
    suspend(): void;
    resume(): void;
    private dispatch;
    private init;
    private isPolling;
    private pollIntervalRef;
    private getPollInterval;
    private resetPoll;
    private startPoll;
    private stopPoll;
    private poll;
}
//# sourceMappingURL=agent.d.ts.map