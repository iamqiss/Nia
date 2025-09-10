import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
export function errorHandler(err, _req, res, _next) {
    if (err instanceof AppError) {
        logger.warn({ err }, 'Handled AppError');
        res.status(err.statusCode).json({ error: err.code, message: err.message, details: err.details });
        return;
    }
    logger.error({ err }, 'Unhandled error');
    res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Internal Server Error' });
}
//# sourceMappingURL=error.js.map