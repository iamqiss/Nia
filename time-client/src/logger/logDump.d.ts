import { type LogContext, type LogLevel, type Metadata } from '#/logger/types';
export type ConsoleTransportEntry = {
    id: string;
    timestamp: number;
    level: LogLevel;
    context: LogContext | undefined;
    message: string | Error;
    metadata: Metadata;
};
export declare function add(entry: ConsoleTransportEntry): void;
export declare function getEntries(): ConsoleTransportEntry[];
//# sourceMappingURL=logDump.d.ts.map