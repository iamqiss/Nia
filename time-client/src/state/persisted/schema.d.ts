import { z } from 'zod';
/**
 * A account persisted to storage. Stored in the `accounts[]` array. Contains
 * base account info and access tokens.
 */
declare const accountSchema: z.ZodObject<{
    service: z.ZodString;
    did: z.ZodString;
    handle: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    emailConfirmed: z.ZodOptional<z.ZodBoolean>;
    emailAuthFactor: z.ZodOptional<z.ZodBoolean>;
    refreshJwt: z.ZodOptional<z.ZodString>;
    accessJwt: z.ZodOptional<z.ZodString>;
    signupQueued: z.ZodOptional<z.ZodBoolean>;
    active: z.ZodOptional<z.ZodBoolean>;
    status: z.ZodOptional<z.ZodString>;
    pdsUrl: z.ZodOptional<z.ZodString>;
    isSelfHosted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type PersistedAccount = z.infer<typeof accountSchema>;
/**
 * The current account. Stored in the `currentAccount` field.
 *
 * In previous versions, this included tokens and other info. Now, it's used
 * only to reference the `did` field, and all other fields are marked as
 * optional. They should be considered deprecated and not used, but are kept
 * here for backwards compat.
 */
declare const currentAccountSchema: z.ZodObject<{
    did: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    emailConfirmed: z.ZodOptional<z.ZodBoolean>;
    emailAuthFactor: z.ZodOptional<z.ZodBoolean>;
    refreshJwt: z.ZodOptional<z.ZodString>;
    accessJwt: z.ZodOptional<z.ZodString>;
    signupQueued: z.ZodOptional<z.ZodBoolean>;
    active: z.ZodOptional<z.ZodBoolean>;
    status: z.ZodOptional<z.ZodString>;
    pdsUrl: z.ZodOptional<z.ZodString>;
    isSelfHosted: z.ZodOptional<z.ZodBoolean>;
    service: z.ZodOptional<z.ZodString>;
    handle: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type PersistedCurrentAccount = z.infer<typeof currentAccountSchema>;
declare const schema: z.ZodObject<{
    colorMode: z.ZodEnum<{
        system: "system";
        light: "light";
        dark: "dark";
    }>;
    darkTheme: z.ZodOptional<z.ZodEnum<{
        dark: "dark";
        dim: "dim";
    }>>;
    session: z.ZodObject<{
        accounts: z.ZodArray<z.ZodObject<{
            service: z.ZodString;
            did: z.ZodString;
            handle: z.ZodString;
            email: z.ZodOptional<z.ZodString>;
            emailConfirmed: z.ZodOptional<z.ZodBoolean>;
            emailAuthFactor: z.ZodOptional<z.ZodBoolean>;
            refreshJwt: z.ZodOptional<z.ZodString>;
            accessJwt: z.ZodOptional<z.ZodString>;
            signupQueued: z.ZodOptional<z.ZodBoolean>;
            active: z.ZodOptional<z.ZodBoolean>;
            status: z.ZodOptional<z.ZodString>;
            pdsUrl: z.ZodOptional<z.ZodString>;
            isSelfHosted: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
        currentAccount: z.ZodOptional<z.ZodObject<{
            did: z.ZodString;
            email: z.ZodOptional<z.ZodString>;
            emailConfirmed: z.ZodOptional<z.ZodBoolean>;
            emailAuthFactor: z.ZodOptional<z.ZodBoolean>;
            refreshJwt: z.ZodOptional<z.ZodString>;
            accessJwt: z.ZodOptional<z.ZodString>;
            signupQueued: z.ZodOptional<z.ZodBoolean>;
            active: z.ZodOptional<z.ZodBoolean>;
            status: z.ZodOptional<z.ZodString>;
            pdsUrl: z.ZodOptional<z.ZodString>;
            isSelfHosted: z.ZodOptional<z.ZodBoolean>;
            service: z.ZodOptional<z.ZodString>;
            handle: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    reminders: z.ZodObject<{
        lastEmailConfirm: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    languagePrefs: z.ZodObject<{
        primaryLanguage: z.ZodString;
        contentLanguages: z.ZodArray<z.ZodString>;
        postLanguage: z.ZodString;
        postLanguageHistory: z.ZodArray<z.ZodString>;
        appLanguage: z.ZodString;
    }, z.core.$strip>;
    requireAltTextEnabled: z.ZodBoolean;
    largeAltBadgeEnabled: z.ZodOptional<z.ZodBoolean>;
    externalEmbeds: z.ZodOptional<z.ZodObject<{
        giphy: z.ZodOptional<z.ZodEnum<{
            show: "show";
            hide: "hide";
        }>>;
        tenor: z.ZodOptional<z.ZodEnum<{
            show: "show";
            hide: "hide";
        }>>;
        youtube: z.ZodOptional<z.ZodEnum<{
            show: "show";
            hide: "hide";
        }>>;
        youtubeShorts: z.ZodOptional<z.ZodEnum<{
            show: "show";
            hide: "hide";
        }>>;
        twitch: z.ZodOptional<z.ZodEnum<{
            show: "show";
            hide: "hide";
        }>>;
        vimeo: z.ZodOptional<z.ZodEnum<{
            show: "show";
            hide: "hide";
        }>>;
        spotify: z.ZodOptional<z.ZodEnum<{
            show: "show";
            hide: "hide";
        }>>;
        appleMusic: z.ZodOptional<z.ZodEnum<{
            show: "show";
            hide: "hide";
        }>>;
        soundcloud: z.ZodOptional<z.ZodEnum<{
            show: "show";
            hide: "hide";
        }>>;
        flickr: z.ZodOptional<z.ZodEnum<{
            show: "show";
            hide: "hide";
        }>>;
    }, z.core.$strip>>;
    invites: z.ZodObject<{
        copiedInvites: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
    onboarding: z.ZodObject<{
        step: z.ZodString;
    }, z.core.$strip>;
    hiddenPosts: z.ZodOptional<z.ZodArray<z.ZodString>>;
    useInAppBrowser: z.ZodOptional<z.ZodBoolean>;
    lastSelectedHomeFeed: z.ZodOptional<z.ZodString>;
    pdsAddressHistory: z.ZodOptional<z.ZodArray<z.ZodString>>;
    disableHaptics: z.ZodOptional<z.ZodBoolean>;
    disableAutoplay: z.ZodOptional<z.ZodBoolean>;
    kawaii: z.ZodOptional<z.ZodBoolean>;
    hasCheckedForStarterPack: z.ZodOptional<z.ZodBoolean>;
    subtitlesEnabled: z.ZodOptional<z.ZodBoolean>;
    mutedThreads: z.ZodArray<z.ZodString>;
    trendingDisabled: z.ZodOptional<z.ZodBoolean>;
    trendingVideoDisabled: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type Schema = z.infer<typeof schema>;
export declare const defaults: Schema;
export declare function tryParse(rawData: string): Schema | undefined;
export declare function tryStringify(value: Schema): string | undefined;
export {};
//# sourceMappingURL=schema.d.ts.map