import pino from 'pino';
import { config } from '../config/index.js';
const isDev = config.env === 'development';
export const logger = pino(isDev
    ? {
        level: process.env.LOG_LEVEL || 'debug',
        transport: {
            target: 'pino-pretty',
            options: { colorize: true, translateTime: 'SYS:standard', singleLine: false },
        },
    }
    : { level: process.env.LOG_LEVEL || 'info' });
//# sourceMappingURL=logger.js.map