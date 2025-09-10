import { ErrorRequestHandler, Request, RequestHandler, Response } from 'express';
import { httpLogger } from '../logger.js';
export const handler = (runHandler) => {
    return async (req, res, next) => {
        try {
            await runHandler(req, res);
        }
        catch (err) {
            next(err);
        }
    };
};
export const errorHandler = (err, _req, res, next) => {
    httpLogger.error({ err }, 'request error');
    if (res.headersSent) {
        return next(err);
    }
    return res.status(500).end('server error');
};
//# sourceMappingURL=util.js.map