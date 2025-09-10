import { AtpAgent } from '@atproto/api';
import { Config } from './config.js';
export type AppContextOptions = {
    cfg: Config;
    appviewAgent: AtpAgent;
    fonts: {
        name: string;
        data: Buffer;
    }[];
};
export declare class AppContext {
    private opts;
    cfg: Config;
    appviewAgent: AtpAgent;
    fonts: {
        name: string;
        data: Buffer;
    }[];
    abortController: AbortController;
    constructor(opts: AppContextOptions);
    static fromConfig(cfg: Config, overrides?: Partial<AppContextOptions>): Promise<AppContext>;
}
//# sourceMappingURL=context.d.ts.map