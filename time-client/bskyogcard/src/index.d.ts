import type http from 'node:http';
import express from 'express';
import { type Config } from './config.js';
import { AppContext } from './context.js';
export * from './config.js';
export * from './logger.js';
export declare class CardService {
    app: express.Application;
    ctx: AppContext;
    server?: http.Server;
    private terminator?;
    constructor(app: express.Application, ctx: AppContext);
    static create(cfg: Config): Promise<CardService>;
    start(): Promise<void>;
    destroy(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map