import { AtpAgent, CredentialSession, } from '@atproto/api';
import { ExpiredTokenError } from '@atproto/api/dist/client/types/com/atproto/server/confirmEmail.js';
import { MINUTE } from '@atproto/common';
import { LRUCache } from 'lru-cache';
import {} from '../config.js';
import {} from '../db/schema.js';
import { redirectLogger } from '../logger.js';
const SAFELINK_MIN_FETCH_INTERVAL = 1_000;
const SAFELINK_MAX_FETCH_INTERVAL = 10_000;
const SCHEME_REGEX = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;
export class SafelinkClient {
    domainCache;
    urlCache;
    db;
    ozoneAgent;
    cursor;
    constructor({ cfg, db }) {
        this.domainCache = new LRUCache({
            max: 10000,
        });
        this.urlCache = new LRUCache({
            max: 25000,
        });
        this.db = db;
        this.ozoneAgent = new OzoneAgent(cfg.safelinkPdsUrl, cfg.safelinkAgentIdentifier, cfg.safelinkAgentPass);
    }
    async tryFindRule(link) {
        let url;
        let domain;
        try {
            url = SafelinkClient.normalizeUrl(link);
            domain = SafelinkClient.normalizeDomain(link);
        }
        catch (e) {
            redirectLogger.error({ error: e, inputUrl: link }, 'failed to normalize looked up link');
            // fail open
            return 'ok';
        }
        // First, check if there is an existing URL rule. Note that even if the rule is 'ok', we still
        // want to check for a blocking domain rule, so we will only return here if the url rule exists
        // _and_ it is not 'ok'.
        const urlRule = this.urlCache.get(url);
        if (urlRule && urlRule !== 'ok') {
            return urlRule;
        }
        // If we find a domain rule of _any_ kind, including 'ok', we can now return that rule.
        const domainRule = this.domainCache.get(domain);
        if (domainRule) {
            return domainRule;
        }
        try {
            const maybeUrlRule = await this.getRule(this.db, url, 'url');
            this.urlCache.set(url, maybeUrlRule);
            return maybeUrlRule;
        }
        catch (e) {
            this.urlCache.set(url, 'ok');
        }
        try {
            const maybeDomainRule = await this.getRule(this.db, domain, 'domain');
            this.domainCache.set(domain, maybeDomainRule);
            return maybeDomainRule;
        }
        catch (e) {
            this.domainCache.set(domain, 'ok');
        }
        return 'ok';
    }
    async getRule(db, url, pattern) {
        return db.db
            .selectFrom('safelink_rule')
            .selectAll()
            .where('url', '=', url)
            .where('pattern', '=', pattern)
            .orderBy('createdAt', 'desc')
            .executeTakeFirstOrThrow();
    }
    async addRule(db, rule) {
        try {
            if (rule.pattern === 'url') {
                rule.url = SafelinkClient.normalizeUrl(rule.url);
            }
            else if (rule.pattern === 'domain') {
                rule.url = SafelinkClient.normalizeDomain(rule.url);
            }
        }
        catch (e) {
            redirectLogger.error({ error: e, inputUrl: rule.url }, 'failed to normalize rule input URL');
            return;
        }
        db.db
            .insertInto('safelink_rule')
            .values({
            id: rule.id,
            eventType: rule.eventType,
            url: rule.url,
            pattern: rule.pattern,
            action: rule.action,
            createdAt: rule.createdAt,
        })
            .execute()
            .catch(err => {
            redirectLogger.error({ error: err, rule }, 'failed to add rule to database');
        });
        if (rule.pattern === 'domain') {
            this.domainCache.delete(rule.url);
        }
        else {
            this.urlCache.delete(rule.url);
        }
    }
    async removeRule(db, rule) {
        try {
            if (rule.pattern === 'url') {
                rule.url = SafelinkClient.normalizeUrl(rule.url);
            }
            else if (rule.pattern === 'domain') {
                rule.url = SafelinkClient.normalizeDomain(rule.url);
            }
        }
        catch (e) {
            redirectLogger.error({ error: e, inputUrl: rule.url }, 'failed to normalize rule input URL');
            return;
        }
        await db.db
            .deleteFrom('safelink_rule')
            .where('pattern', '=', 'domain')
            .where('url', '=', rule.url)
            .execute()
            .catch(err => {
            redirectLogger.error({ error: err, rule }, 'failed to remove rule from database');
        });
        if (rule.pattern === 'domain') {
            this.domainCache.delete(rule.url);
        }
        else {
            this.urlCache.delete(rule.url);
        }
    }
    async runFetchEvents() {
        let agent;
        try {
            agent = await this.ozoneAgent.getAgent();
        }
        catch (err) {
            redirectLogger.error({ error: err }, 'error getting Ozone agent');
            setTimeout(() => this.runFetchEvents(), SAFELINK_MAX_FETCH_INTERVAL);
            return;
        }
        let res;
        try {
            const cursor = await this.getCursor();
            res = await agent.tools.ozone.safelink.queryEvents({
                cursor,
                limit: 100,
                sortDirection: 'asc',
            });
        }
        catch (err) {
            if (err instanceof ExpiredTokenError) {
                redirectLogger.info('ozone agent had expired session, refreshing...');
                await this.ozoneAgent.refreshSession();
                setTimeout(() => this.runFetchEvents(), SAFELINK_MIN_FETCH_INTERVAL);
                return;
            }
            redirectLogger.error({ error: err }, 'error fetching safelink events from Ozone');
            setTimeout(() => this.runFetchEvents(), SAFELINK_MAX_FETCH_INTERVAL);
            return;
        }
        if (res.data.events.length === 0) {
            redirectLogger.info('received no new safelink events from ozone');
            setTimeout(() => this.runFetchEvents(), SAFELINK_MAX_FETCH_INTERVAL);
        }
        else {
            await this.db.transaction(async (db) => {
                for (const rule of res.data.events) {
                    switch (rule.eventType) {
                        case 'removeRule':
                            await this.removeRule(db, rule);
                            break;
                        case 'addRule':
                        case 'updateRule':
                            await this.addRule(db, rule);
                            break;
                        default:
                            redirectLogger.warn({ rule }, 'received unknown rule event type');
                    }
                }
            });
            if (res.data.cursor) {
                redirectLogger.info({ cursor: res.data.cursor }, 'received new safelink events from Ozone');
                await this.setCursor(res.data.cursor);
            }
            setTimeout(() => this.runFetchEvents(), SAFELINK_MIN_FETCH_INTERVAL);
        }
    }
    async getCursor() {
        if (this.cursor === '') {
            const res = await this.db.db
                .selectFrom('safelink_cursor')
                .selectAll()
                .where('id', '=', 1)
                .executeTakeFirst();
            if (!res) {
                return '';
            }
            this.cursor = res.cursor;
        }
        return this.cursor;
    }
    async setCursor(cursor) {
        const updatedAt = new Date();
        try {
            await this.db.db
                .insertInto('safelink_cursor')
                .values({
                id: 1,
                cursor,
                updatedAt,
            })
                .onConflict(oc => oc.column('id').doUpdateSet({ cursor, updatedAt }))
                .execute();
            this.cursor = cursor;
        }
        catch (err) {
            redirectLogger.error({ error: err }, 'failed to update safelink cursor');
        }
    }
    static normalizeUrl(input) {
        if (!SCHEME_REGEX.test(input)) {
            input = `https://${input}`;
        }
        const u = new URL(input);
        u.hash = '';
        let normalized = u.href.replace(SCHEME_REGEX, '').toLowerCase();
        if (normalized.endsWith('/')) {
            normalized = normalized.substring(0, normalized.length - 1);
        }
        return normalized;
    }
    static normalizeDomain(input) {
        if (!SCHEME_REGEX.test(input)) {
            input = `https://${input}`;
        }
        const u = new URL(input);
        return u.host.toLowerCase();
    }
}
export class OzoneAgent {
    identifier;
    password;
    session;
    agent;
    refreshAt = 0;
    constructor(pdsHost, identifier, password) {
        this.identifier = identifier;
        this.password = password;
        this.session = new CredentialSession(new URL(pdsHost));
        this.agent = new AtpAgent(this.session);
    }
    async getAgent() {
        if (!this.identifier && !this.password) {
            throw new Error('OZONE_AGENT_HANDLE and OZONE_AGENT_PASS environment variables must be set');
        }
        if (!this.session.hasSession) {
            redirectLogger.info('creating Ozone session');
            await this.session.login({
                identifier: this.identifier,
                password: this.password,
            });
            redirectLogger.info('ozone session created successfully');
            this.refreshAt = Date.now() + 50 * MINUTE;
        }
        if (Date.now() <= this.refreshAt) {
            await this.refreshSession();
        }
        return this.agent;
    }
    async refreshSession() {
        try {
            await this.session.refreshSession();
            this.refreshAt = Date.now() + 50 * MINUTE;
        }
        catch (e) {
            redirectLogger.error({ error: e }, 'error refreshing session');
        }
    }
}
//# sourceMappingURL=safelinkClient.js.map