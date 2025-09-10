import { nanoid } from 'nanoid/non-secure';
import { logEvent } from '#/lib/statsig/statsig';
import { add } from '#/logger/logDump';
import {} from '#/logger/metrics';
import { bitdriftTransport } from '#/logger/transports/bitdrift';
import { consoleTransport } from '#/logger/transports/console';
import { sentryTransport } from '#/logger/transports/sentry';
import { LogContext, LogLevel, } from '#/logger/types';
import { enabledLogLevels } from '#/logger/util';
import { isNative } from '#/platform/detection';
import { ENV } from '#/env';
const TRANSPORTS = (function configureTransports() {
    switch (ENV) {
        case 'production': {
            return [sentryTransport, isNative && bitdriftTransport].filter(Boolean);
        }
        case 'test': {
            return [];
        }
        default: {
            return [consoleTransport];
        }
    }
})();
export class Logger {
    static Level = LogLevel;
    static Context = LogContext;
    level;
    context = undefined;
    contextFilter = '';
    debugContextRegexes = [];
    transports = [];
    static create(context) {
        const logger = new Logger({
            level: process.env.EXPO_PUBLIC_LOG_LEVEL,
            context,
            contextFilter: process.env.EXPO_PUBLIC_LOG_DEBUG || '',
        });
        for (const transport of TRANSPORTS) {
            logger.addTransport(transport);
        }
        return logger;
    }
    constructor({ level, context, contextFilter, } = {}) {
        this.context = context;
        this.level = level || LogLevel.Info;
        this.contextFilter = contextFilter || '';
        if (this.contextFilter) {
            this.level = LogLevel.Debug;
        }
        this.debugContextRegexes = (this.contextFilter || '')
            .split(',')
            .map(filter => {
            return new RegExp(filter.replace(/[^\w:*-]/, '').replace(/\*/g, '.*'));
        });
    }
    debug(message, metadata = {}) {
        this.transport({ level: LogLevel.Debug, message, metadata });
    }
    info(message, metadata = {}) {
        this.transport({ level: LogLevel.Info, message, metadata });
    }
    log(message, metadata = {}) {
        this.transport({ level: LogLevel.Log, message, metadata });
    }
    warn(message, metadata = {}) {
        this.transport({ level: LogLevel.Warn, message, metadata });
    }
    error(error, metadata = {}) {
        this.transport({ level: LogLevel.Error, message: error, metadata });
    }
    metric(event, metadata, options = { statsig: true }) {
        logEvent(event, metadata, {
            lake: !options.statsig,
        });
        for (const transport of this.transports) {
            transport(LogLevel.Info, LogContext.Metric, event, metadata, Date.now());
        }
    }
    addTransport(transport) {
        this.transports.push(transport);
        return () => {
            this.transports.splice(this.transports.indexOf(transport), 1);
        };
    }
    transport({ level, message, metadata = {}, }) {
        if (level === LogLevel.Debug &&
            !!this.contextFilter &&
            !!this.context &&
            !this.debugContextRegexes.find(reg => reg.test(this.context)))
            return;
        const timestamp = Date.now();
        const meta = metadata || {};
        // send every log to syslog
        add({
            id: nanoid(),
            timestamp,
            level,
            context: this.context,
            message,
            metadata: meta,
        });
        if (!enabledLogLevels[this.level].includes(level))
            return;
        for (const transport of this.transports) {
            transport(level, this.context, message, meta, timestamp);
        }
    }
}
/**
 * Default logger instance. See `@/logger/README` for docs.
 *
 * Basic usage:
 *
 *   `logger.debug(message[, metadata])`
 *   `logger.info(message[, metadata])`
 *   `logger.log(message[, metadata])`
 *   `logger.warn(message[, metadata])`
 *   `logger.error(error[, metadata])`
 */
export const logger = Logger.create(Logger.Context.Default);
//# sourceMappingURL=index.js.map