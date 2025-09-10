import events from 'node:events';
import express from 'express';
import { createHttpTerminator } from 'http-terminator';
import {} from './config.js';
import { AppContext } from './context.js';
import { default as routes, errorHandler } from './routes/index.js';
export * from './config.js';
export * from './logger.js';
export class CardService {
    app;
    ctx;
    server;
    terminator;
    constructor(app, ctx) {
        this.app = app;
        this.ctx = ctx;
    }
    static async create(cfg) {
        let app = express();
        const ctx = await AppContext.fromConfig(cfg);
        app = routes(ctx, app);
        app.use(errorHandler);
        return new CardService(app, ctx);
    }
    async start() {
        this.server = this.app.listen(this.ctx.cfg.service.port);
        this.server.keepAliveTimeout = 90000;
        this.terminator = createHttpTerminator({ server: this.server });
        await events.once(this.server, 'listening');
    }
    async destroy() {
        this.ctx.abortController.abort();
        await this.terminator?.terminate();
    }
}
//# sourceMappingURL=index.js.map