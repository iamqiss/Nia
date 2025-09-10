import { type AppBskyNotificationDefs } from '@atproto/api';
import { type FilterablePreference } from '@atproto/api/dist/client/types/app/bsky/notification/defs';
export declare function PreferenceControls({ name, syncOthers, preference, allowDisableInApp, }: {
    name: Exclude<keyof AppBskyNotificationDefs.Preferences, '$type'>;
    /**
     * Keep other prefs in sync with `name`. For use in the "everything else" category
     * which groups starterpack joins + verified + unverified notifications into a single toggle.
     */
    syncOthers?: Exclude<keyof AppBskyNotificationDefs.Preferences, '$type'>[];
    preference?: AppBskyNotificationDefs.Preference | FilterablePreference;
    allowDisableInApp?: boolean;
}): any;
export declare function Inner({ name, syncOthers, preference, allowDisableInApp, }: {
    name: Exclude<keyof AppBskyNotificationDefs.Preferences, '$type'>;
    syncOthers?: Exclude<keyof AppBskyNotificationDefs.Preferences, '$type'>[];
    preference: AppBskyNotificationDefs.Preference | FilterablePreference;
    allowDisableInApp: boolean;
}): any;
//# sourceMappingURL=PreferenceControls.d.ts.map