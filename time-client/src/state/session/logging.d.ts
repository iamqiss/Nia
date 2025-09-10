import { type AtpSessionData, type AtpSessionEvent } from '@atproto/api';
import { type Schema } from '../persisted';
import { type Action, type State } from './reducer';
import { type SessionAccount } from './types';
type Reducer = (state: State, action: Action) => State;
type Log = {
    type: 'reducer:init';
    state: State;
} | {
    type: 'reducer:call';
    action: Action;
    prevState: State;
    nextState: State;
} | {
    type: 'method:start';
    method: 'createAccount' | 'login' | 'logout' | 'resumeSession' | 'removeAccount';
    account?: SessionAccount;
} | {
    type: 'method:end';
    method: 'createAccount' | 'login' | 'logout' | 'resumeSession' | 'removeAccount';
    account?: SessionAccount;
} | {
    type: 'persisted:broadcast';
    data: Schema['session'];
} | {
    type: 'persisted:receive';
    data: Schema['session'];
} | {
    type: 'agent:switch';
    prevAgent: object;
    nextAgent: object;
} | {
    type: 'agent:patch';
    agent: object;
    prevSession: AtpSessionData | undefined;
    nextSession: AtpSessionData | undefined;
};
export declare function wrapSessionReducerForLogging(reducer: Reducer): Reducer;
export declare function addSessionErrorLog(did: string, event: AtpSessionEvent): void;
export declare function addSessionDebugLog(log: Log): void;
export {};
//# sourceMappingURL=logging.d.ts.map