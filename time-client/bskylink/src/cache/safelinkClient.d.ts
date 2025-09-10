import { type ServiceConfig } from '../config.js';
import type Database from '../db/index.js';
import { type SafelinkRule } from '../db/schema.js';
export declare class SafelinkClient {
    private domainCache;
    private urlCache;
    private db;
    private ozoneAgent;
    private cursor?;
    constructor({ cfg, db }: {
        cfg: ServiceConfig;
        db: Database;
    });
    tryFindRule(link: string): Promise<SafelinkRule | 'ok'>;
    private getRule;
    private addRule;
    private removeRule;
    runFetchEvents(): Promise<void>;
    private getCursor;
    private setCursor;
    private static normalizeUrl;
    private static normalizeDomain;
}
export declare class OzoneAgent {
    private identifier;
    private password;
    private session;
    private agent;
    private refreshAt;
    constructor(pdsHost: string, identifier: string, password: string);
    getAgent(): Promise<AtpAgent>;
    refreshSession(): Promise<void>;
}
//# sourceMappingURL=safelinkClient.d.ts.map