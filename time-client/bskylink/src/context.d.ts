import { SafelinkClient } from './cache/safelinkClient.js';
import { type Config } from './config.js';
import Database from './db/index.js';
export type AppContextOptions = {
    cfg: Config;
    db: Database;
};
export declare class AppContext {
    private opts;
    cfg: Config;
    db: Database;
    safelinkClient: SafelinkClient;
    abortController: AbortController;
    constructor(opts: AppContextOptions);
    static fromConfig(cfg: Config, overrides?: Partial<AppContextOptions>): Promise<AppContext>;
}
//# sourceMappingURL=context.d.ts.map