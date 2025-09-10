import { LogLevel, type Metadata, type Serializable } from '#/logger/types';
export declare const enabledLogLevels: {
    [key in LogLevel]: LogLevel[];
};
export declare function prepareMetadata(metadata: Metadata): Record<string, Serializable>;
//# sourceMappingURL=util.d.ts.map