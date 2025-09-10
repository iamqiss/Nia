import { SafelinkClient } from './cache/safelinkClient.js';
import {} from './config.js';
import Database from './db/index.js';
export class AppContext {
    opts;
    cfg;
    db;
    safelinkClient;
    abortController = new AbortController();
    constructor(opts) {
        this.opts = opts;
        this.cfg = this.opts.cfg;
        this.db = this.opts.db;
        this.safelinkClient = new SafelinkClient({
            cfg: this.opts.cfg.service,
            db: this.opts.db,
        });
    }
    static async fromConfig(cfg, overrides) {
        const db = Database.postgres({
            url: cfg.db.url,
            schema: cfg.db.schema,
            poolSize: cfg.db.pool.size,
            poolMaxUses: cfg.db.pool.maxUses,
            poolIdleTimeoutMs: cfg.db.pool.idleTimeoutMs,
        });
        return new AppContext({
            cfg,
            db,
            ...overrides,
        });
    }
}
//# sourceMappingURL=context.js.map