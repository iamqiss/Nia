import { Agent as BaseAgent, BskyAgent, } from '@atproto/api';
import {} from '@atproto/api/dist/agent';
import {} from '@atproto/api/dist/session-manager';
import { TID } from '@atproto/common-web';
import {} from '@atproto/xrpc';
import { networkRetry } from '#/lib/async/retry';
import { BLUESKY_PROXY_HEADER, BSKY_SERVICE, DISCOVER_SAVED_FEED, IS_PROD_SERVICE, PUBLIC_BSKY_SERVICE, TIMELINE_SAVED_FEED, } from '#/lib/constants';
import { tryFetchGates } from '#/lib/statsig/statsig';
import { getAge } from '#/lib/strings/time';
import { logger } from '#/logger';
import { snoozeEmailConfirmationPrompt } from '#/state/shell/reminders';
import { emitNetworkConfirmed, emitNetworkLost } from '../events';
import { addSessionErrorLog } from './logging';
import { configureModerationForAccount, configureModerationForGuest, } from './moderation';
import {} from './types';
import { isSessionExpired, isSignupQueued } from './util';
export function createPublicAgent() {
    configureModerationForGuest(); // Side effect but only relevant for tests
    const agent = new BskyAppAgent({ service: PUBLIC_BSKY_SERVICE });
    agent.configureProxy(BLUESKY_PROXY_HEADER.get());
    return agent;
}
export async function createAgentAndResume(storedAccount, onSessionChange) {
    const agent = new BskyAppAgent({ service: storedAccount.service });
    if (storedAccount.pdsUrl) {
        agent.sessionManager.pdsUrl = new URL(storedAccount.pdsUrl);
    }
    const gates = tryFetchGates(storedAccount.did, 'prefer-low-latency');
    const moderation = configureModerationForAccount(agent, storedAccount);
    const prevSession = sessionAccountToSession(storedAccount);
    if (isSessionExpired(storedAccount)) {
        await networkRetry(1, () => agent.resumeSession(prevSession));
    }
    else {
        agent.sessionManager.session = prevSession;
        if (!storedAccount.signupQueued) {
            networkRetry(3, () => agent.resumeSession(prevSession)).catch((e) => {
                logger.error(`networkRetry failed to resume session`, {
                    status: e?.status || 'unknown',
                    // this field name is ignored by Sentry scrubbers
                    safeMessage: e?.message || 'unknown',
                });
                throw e;
            });
        }
    }
    agent.configureProxy(BLUESKY_PROXY_HEADER.get());
    return agent.prepare(gates, moderation, onSessionChange);
}
export async function createAgentAndLogin({ service, identifier, password, authFactorToken, }, onSessionChange) {
    const agent = new BskyAppAgent({ service });
    await agent.login({
        identifier,
        password,
        authFactorToken,
        allowTakendown: true,
    });
    const account = agentToSessionAccountOrThrow(agent);
    const gates = tryFetchGates(account.did, 'prefer-fresh-gates');
    const moderation = configureModerationForAccount(agent, account);
    agent.configureProxy(BLUESKY_PROXY_HEADER.get());
    return agent.prepare(gates, moderation, onSessionChange);
}
export async function createAgentAndCreateAccount({ service, email, password, handle, birthDate, inviteCode, verificationPhone, verificationCode, }, onSessionChange) {
    const agent = new BskyAppAgent({ service });
    await agent.createAccount({
        email,
        password,
        handle,
        inviteCode,
        verificationPhone,
        verificationCode,
    });
    const account = agentToSessionAccountOrThrow(agent);
    const gates = tryFetchGates(account.did, 'prefer-fresh-gates');
    const moderation = configureModerationForAccount(agent, account);
    // Not awaited so that we can still get into onboarding.
    // This is OK because we won't let you toggle adult stuff until you set the date.
    if (IS_PROD_SERVICE(service)) {
        try {
            networkRetry(1, async () => {
                await agent.setPersonalDetails({ birthDate: birthDate.toISOString() });
                await agent.overwriteSavedFeeds([
                    {
                        ...DISCOVER_SAVED_FEED,
                        id: TID.nextStr(),
                    },
                    {
                        ...TIMELINE_SAVED_FEED,
                        id: TID.nextStr(),
                    },
                ]);
                if (getAge(birthDate) < 18) {
                    await agent.api.com.atproto.repo.putRecord({
                        repo: account.did,
                        collection: 'chat.bsky.actor.declaration',
                        rkey: 'self',
                        record: {
                            $type: 'chat.bsky.actor.declaration',
                            allowIncoming: 'none',
                        },
                    });
                }
            });
        }
        catch (e) {
            logger.error(e, {
                message: `session: createAgentAndCreateAccount failed to save personal details and feeds`,
            });
        }
    }
    else {
        agent.setPersonalDetails({ birthDate: birthDate.toISOString() });
    }
    try {
        // snooze first prompt after signup, defer to next prompt
        snoozeEmailConfirmationPrompt();
    }
    catch (e) {
        logger.error(e, { message: `session: failed snoozeEmailConfirmationPrompt` });
    }
    agent.configureProxy(BLUESKY_PROXY_HEADER.get());
    return agent.prepare(gates, moderation, onSessionChange);
}
export function agentToSessionAccountOrThrow(agent) {
    const account = agentToSessionAccount(agent);
    if (!account) {
        throw Error('Expected an active session');
    }
    return account;
}
export function agentToSessionAccount(agent) {
    if (!agent.session) {
        return undefined;
    }
    return {
        service: agent.service.toString(),
        did: agent.session.did,
        handle: agent.session.handle,
        email: agent.session.email,
        emailConfirmed: agent.session.emailConfirmed || false,
        emailAuthFactor: agent.session.emailAuthFactor || false,
        refreshJwt: agent.session.refreshJwt,
        accessJwt: agent.session.accessJwt,
        signupQueued: isSignupQueued(agent.session.accessJwt),
        active: agent.session.active,
        status: agent.session.status,
        pdsUrl: agent.pdsUrl?.toString(),
        isSelfHosted: !agent.serviceUrl.toString().startsWith(BSKY_SERVICE),
    };
}
export function sessionAccountToSession(account) {
    return {
        // Sorted in the same property order as when returned by BskyAgent (alphabetical).
        accessJwt: account.accessJwt ?? '',
        did: account.did,
        email: account.email,
        emailAuthFactor: account.emailAuthFactor,
        emailConfirmed: account.emailConfirmed,
        handle: account.handle,
        refreshJwt: account.refreshJwt ?? '',
        /**
         * @see https://github.com/bluesky-social/atproto/blob/c5d36d5ba2a2c2a5c4f366a5621c06a5608e361e/packages/api/src/agent.ts#L188
         */
        active: account.active ?? true,
        status: account.status,
    };
}
export class Agent extends BaseAgent {
    constructor(proxyHeader, options) {
        super(options);
        if (proxyHeader) {
            this.configureProxy(proxyHeader);
        }
    }
}
// Not exported. Use factories above to create it.
// WARN: In the factories above, we _manually set a proxy header_ for the agent after we do whatever it is we are supposed to do.
// Ideally, we wouldn't be doing this. However, since there is so much logic that requires making calls to the PDS right now, it
// feels safer to just let those run as-is and set the header afterward.
let realFetch = globalThis.fetch;
class BskyAppAgent extends BskyAgent {
    persistSessionHandler = undefined;
    constructor({ service }) {
        super({
            service,
            async fetch(...args) {
                let success = false;
                try {
                    const result = await realFetch(...args);
                    success = true;
                    return result;
                }
                catch (e) {
                    success = false;
                    throw e;
                }
                finally {
                    if (success) {
                        emitNetworkConfirmed();
                    }
                    else {
                        emitNetworkLost();
                    }
                }
            },
            persistSession: (event) => {
                if (this.persistSessionHandler) {
                    this.persistSessionHandler(event);
                }
            },
        });
    }
    async prepare(
    // Not awaited in the calling code so we can delay blocking on them.
    gates, moderation, onSessionChange) {
        // There's nothing else left to do, so block on them here.
        await Promise.all([gates, moderation]);
        // Now the agent is ready.
        const account = agentToSessionAccountOrThrow(this);
        let lastSession = this.sessionManager.session;
        this.persistSessionHandler = event => {
            if (this.sessionManager.session) {
                lastSession = this.sessionManager.session;
            }
            else if (event === 'network-error') {
                // Put it back, we'll try again later.
                this.sessionManager.session = lastSession;
            }
            onSessionChange(this, account.did, event);
            if (event !== 'create' && event !== 'update') {
                addSessionErrorLog(account.did, event);
            }
        };
        return { account, agent: this };
    }
    dispose() {
        this.sessionManager.session = undefined;
        this.persistSessionHandler = undefined;
    }
}
//# sourceMappingURL=agent.js.map