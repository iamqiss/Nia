import { type AtpSessionEvent } from '@atproto/api';
import { type SessionAccount } from './types';
type OpaqueBskyAgent = {
    readonly service: URL;
    readonly api: unknown;
    readonly app: unknown;
    readonly com: unknown;
};
type AgentState = {
    readonly agent: OpaqueBskyAgent;
    readonly did: string | undefined;
};
export type State = {
    readonly accounts: SessionAccount[];
    readonly currentAgentState: AgentState;
    needsPersist: boolean;
};
export type Action = {
    type: 'received-agent-event';
    agent: OpaqueBskyAgent;
    accountDid: string;
    refreshedAccount: SessionAccount | undefined;
    sessionEvent: AtpSessionEvent;
} | {
    type: 'switched-to-account';
    newAgent: OpaqueBskyAgent;
    newAccount: SessionAccount;
} | {
    type: 'removed-account';
    accountDid: string;
} | {
    type: 'logged-out-current-account';
} | {
    type: 'logged-out-every-account';
} | {
    type: 'synced-accounts';
    syncedAccounts: SessionAccount[];
    syncedCurrentDid: string | undefined;
} | {
    type: 'partial-refresh-session';
    accountDid: string;
    patch: Pick<SessionAccount, 'emailConfirmed' | 'emailAuthFactor'>;
};
export declare function getInitialState(persistedAccounts: SessionAccount[]): State;
declare let reducer: (state: State, action: Action) => State;
export { reducer };
//# sourceMappingURL=reducer.d.ts.map