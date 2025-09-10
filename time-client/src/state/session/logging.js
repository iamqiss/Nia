import {} from '@atproto/api';
import { sha256 } from 'js-sha256';
import { Statsig } from 'statsig-react-native-expo';
import { IS_INTERNAL } from '#/env';
import {} from '../persisted';
import {} from './reducer';
import {} from './types';
export function wrapSessionReducerForLogging(reducer) {
    return function loggingWrapper(prevState, action) {
        const nextState = reducer(prevState, action);
        addSessionDebugLog({ type: 'reducer:call', prevState, action, nextState });
        return nextState;
    };
}
let nextMessageIndex = 0;
const MAX_SLICE_LENGTH = 1000;
// Not gated.
export function addSessionErrorLog(did, event) {
    try {
        if (!Statsig.initializeCalled() || !Statsig.getStableID()) {
            return;
        }
        const stack = (new Error().stack ?? '').slice(0, MAX_SLICE_LENGTH);
        Statsig.logEvent('session:error', null, {
            did,
            event,
            stack,
        });
    }
    catch (e) {
        console.error(e);
    }
}
export function addSessionDebugLog(log) {
    try {
        if (!Statsig.initializeCalled() || !Statsig.getStableID()) {
            // Drop these logs for now.
            return;
        }
        // DISABLING THIS GATE DUE TO EME @TODO EME-GATE
        if (!IS_INTERNAL) {
            return;
        }
        // if (!Statsig.checkGate('debug_session')) {
        //   return
        // }
        const messageIndex = nextMessageIndex++;
        const { type, ...content } = log;
        let payload = JSON.stringify(content, replacer);
        let nextSliceIndex = 0;
        while (payload.length > 0) {
            const sliceIndex = nextSliceIndex++;
            const slice = payload.slice(0, MAX_SLICE_LENGTH);
            payload = payload.slice(MAX_SLICE_LENGTH);
            Statsig.logEvent('session:debug', null, {
                realmId,
                messageIndex: String(messageIndex),
                messageType: type,
                sliceIndex: String(sliceIndex),
                slice,
            });
        }
    }
    catch (e) {
        console.error(e);
    }
}
let agentIds = new WeakMap();
let realmId = Math.random().toString(36).slice(2);
let nextAgentId = 1;
function getAgentId(agent) {
    let id = agentIds.get(agent);
    if (id === undefined) {
        id = realmId + '::' + nextAgentId++;
        agentIds.set(agent, id);
    }
    return id;
}
function replacer(key, value) {
    if (typeof value === 'object' && value != null && 'api' in value) {
        return getAgentId(value);
    }
    if (key === 'service' ||
        key === 'email' ||
        key === 'emailConfirmed' ||
        key === 'emailAuthFactor' ||
        key === 'pdsUrl') {
        return undefined;
    }
    if (typeof value === 'string' &&
        (key === 'refreshJwt' || key === 'accessJwt')) {
        return sha256(value);
    }
    return value;
}
//# sourceMappingURL=logging.js.map