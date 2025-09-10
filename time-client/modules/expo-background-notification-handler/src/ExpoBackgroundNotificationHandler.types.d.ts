export type ExpoBackgroundNotificationHandlerModule = {
    getAllPrefsAsync: () => Promise<BackgroundNotificationHandlerPreferences>;
    getBoolAsync: (forKey: string) => Promise<boolean>;
    getStringAsync: (forKey: string) => Promise<string>;
    getStringArrayAsync: (forKey: string) => Promise<string[]>;
    setBoolAsync: (forKey: keyof BackgroundNotificationHandlerPreferences, value: boolean) => Promise<void>;
    setStringAsync: (forKey: keyof BackgroundNotificationHandlerPreferences, value: string) => Promise<void>;
    setStringArrayAsync: (forKey: keyof BackgroundNotificationHandlerPreferences, value: string[]) => Promise<void>;
    addToStringArrayAsync: (forKey: keyof BackgroundNotificationHandlerPreferences, value: string) => Promise<void>;
    removeFromStringArrayAsync: (forKey: keyof BackgroundNotificationHandlerPreferences, value: string) => Promise<void>;
    addManyToStringArrayAsync: (forKey: keyof BackgroundNotificationHandlerPreferences, value: string[]) => Promise<void>;
    removeManyFromStringArrayAsync: (forKey: keyof BackgroundNotificationHandlerPreferences, value: string[]) => Promise<void>;
    setBadgeCountAsync: (count: number) => Promise<void>;
};
export type BackgroundNotificationHandlerPreferences = {
    playSoundChat: boolean;
};
//# sourceMappingURL=ExpoBackgroundNotificationHandler.types.d.ts.map