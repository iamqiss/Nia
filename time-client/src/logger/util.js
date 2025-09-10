import { LogLevel } from '#/logger/types';
export const enabledLogLevels = {
    [LogLevel.Debug]: [
        LogLevel.Debug,
        LogLevel.Info,
        LogLevel.Log,
        LogLevel.Warn,
        LogLevel.Error,
    ],
    [LogLevel.Info]: [LogLevel.Info, LogLevel.Log, LogLevel.Warn, LogLevel.Error],
    [LogLevel.Log]: [LogLevel.Log, LogLevel.Warn, LogLevel.Error],
    [LogLevel.Warn]: [LogLevel.Warn, LogLevel.Error],
    [LogLevel.Error]: [LogLevel.Error],
};
export function prepareMetadata(metadata) {
    return Object.keys(metadata).reduce((acc, key) => {
        let value = metadata[key];
        if (value instanceof Error) {
            value = value.toString();
        }
        return { ...acc, [key]: value };
    }, {});
}
//# sourceMappingURL=util.js.map