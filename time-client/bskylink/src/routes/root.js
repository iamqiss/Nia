import {} from 'express';
import {} from '../context.js';
import { handler } from './util.js';
export default function (ctx, app) {
    return app.get('/', handler(async (_req, res) => {
        res.setHeader('Location', `https://${ctx.cfg.service.appHostname}`);
        return res.status(301).end();
    }));
}
//# sourceMappingURL=root.js.map