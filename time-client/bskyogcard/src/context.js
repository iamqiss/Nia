import { readdirSync, readFileSync } from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AtpAgent } from '@atproto/api';
import { Config } from './config.js';
const __DIRNAME = path.dirname(fileURLToPath(import.meta.url));
export class AppContext {
    opts;
    cfg;
    appviewAgent;
    fonts;
    abortController = new AbortController();
    constructor(opts) {
        this.opts = opts;
        this.cfg = this.opts.cfg;
        this.appviewAgent = this.opts.appviewAgent;
        this.fonts = this.opts.fonts;
    }
    static async fromConfig(cfg, overrides) {
        const appviewAgent = new AtpAgent({ service: cfg.service.appviewUrl });
        const fontDirectory = path.join(__DIRNAME, 'assets', 'fonts');
        const fontFiles = readdirSync(fontDirectory);
        const fonts = fontFiles.map(file => {
            return {
                name: path.basename(file, path.extname(file)),
                data: readFileSync(path.join(fontDirectory, file)),
            };
        });
        return new AppContext({
            cfg,
            appviewAgent,
            fonts,
            ...overrides,
        });
    }
}
//# sourceMappingURL=context.js.map