import { BackgroundNotificationHandlerPreferences, ExpoBackgroundNotificationHandlerModule, } from './ExpoBackgroundNotificationHandler.types';
// Stub for web
export const BackgroundNotificationHandler = {
    getAllPrefsAsync: async () => {
        return {};
    },
    getBoolAsync: async (_) => {
        return false;
    },
    getStringAsync: async (_) => {
        return '';
    },
    getStringArrayAsync: async (_) => {
        return [];
    },
    setBoolAsync: async (_, __) => { },
    setStringAsync: async (_, __) => { },
    setStringArrayAsync: async (_, __) => { },
    addToStringArrayAsync: async (_, __) => { },
    removeFromStringArrayAsync: async (_, __) => { },
    addManyToStringArrayAsync: async (_, __) => { },
    removeManyFromStringArrayAsync: async (_, __) => { },
    setBadgeCountAsync: async (_) => { },
};
//# sourceMappingURL=ExpoBackgroundNotificationHandlerModule.web.js.map