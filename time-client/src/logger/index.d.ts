import { type MetricEvents } from '#/logger/metrics';
import { LogContext, LogLevel, type Metadata, type Transport } from '#/logger/types';
export declare class Logger {
    static Level: any;
    static Context: any;
    level: LogLevel;
    context: LogContext | undefined;
    contextFilter: string;
    protected debugContextRegexes: RegExp[];
    protected transports: Transport[];
    static create(context?: LogContext): Logger;
    constructor({ level, context, contextFilter, }?: {
        level?: LogLevel;
        context?: LogContext;
        contextFilter?: string;
    });
    debug(message: string, metadata?: Metadata): void;
    info(message: string, metadata?: Metadata): void;
    log(message: string, metadata?: Metadata): void;
    warn(message: string, metadata?: Metadata): void;
    error(error: Error | string, metadata?: Metadata): void;
    metric<E extends keyof MetricEvents>(event: E & string, metadata: MetricEvents[E], options?: {
        /**
         * Optionally also send to StatSig
         */
        statsig?: boolean;
    }): void;
    addTransport(transport: Transport): () => void;
    protected transport({ level, message, metadata, }: {
        level: LogLevel;
        message: string | Error;
        metadata: Metadata;
    }): void;
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
export declare const logger: Logger;
//# sourceMappingURL=index.d.ts.map