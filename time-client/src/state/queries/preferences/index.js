import { useCallback } from 'react';
import {} from '@atproto/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PROD_DEFAULT_FEED } from '#/lib/constants';
import { replaceEqualDeep } from '#/lib/functions';
import { getAge } from '#/lib/strings/time';
import { logger } from '#/logger';
import { useAgeAssuranceContext } from '#/state/ageAssurance';
import { makeAgeRestrictedModerationPrefs } from '#/state/ageAssurance/const';
import { STALE } from '#/state/queries';
import { DEFAULT_HOME_FEED_PREFS, DEFAULT_LOGGED_OUT_PREFERENCES, DEFAULT_THREAD_VIEW_PREFS, } from '#/state/queries/preferences/const';
import {} from '#/state/queries/preferences/types';
import { useAgent } from '#/state/session';
import { saveLabelers } from '#/state/session/agent-config';
export * from '#/state/queries/preferences/const';
export * from '#/state/queries/preferences/moderation';
export * from '#/state/queries/preferences/types';
const preferencesQueryKeyRoot = 'getPreferences';
export const preferencesQueryKey = [preferencesQueryKeyRoot];
export function usePreferencesQuery() {
    const agent = useAgent();
    const { isAgeRestricted } = useAgeAssuranceContext();
    return useQuery({
        staleTime: STALE.SECONDS.FIFTEEN,
        structuralSharing: replaceEqualDeep,
        refetchOnWindowFocus: true,
        queryKey: preferencesQueryKey,
        queryFn: async () => {
            if (!agent.did) {
                return DEFAULT_LOGGED_OUT_PREFERENCES;
            }
            else {
                const res = await agent.getPreferences();
                // save to local storage to ensure there are labels on initial requests
                saveLabelers(agent.did, res.moderationPrefs.labelers.map(l => l.did));
                const preferences = {
                    ...res,
                    savedFeeds: res.savedFeeds.filter(f => f.type !== 'unknown'),
                    /**
                     * Special preference, only used for following feed, previously
                     * called `home`
                     */
                    feedViewPrefs: {
                        ...DEFAULT_HOME_FEED_PREFS,
                        ...(res.feedViewPrefs.home || {}),
                    },
                    threadViewPrefs: {
                        ...DEFAULT_THREAD_VIEW_PREFS,
                        ...(res.threadViewPrefs ?? {}),
                    },
                    userAge: res.birthDate ? getAge(res.birthDate) : undefined,
                };
                return preferences;
            }
        },
        select: useCallback((data) => {
            const isUnderage = (data.userAge || 0) < 18;
            if (isUnderage || isAgeRestricted) {
                data = {
                    ...data,
                    moderationPrefs: makeAgeRestrictedModerationPrefs(data.moderationPrefs),
                };
            }
            return data;
        }, [isAgeRestricted]),
    });
}
export function useClearPreferencesMutation() {
    const queryClient = useQueryClient();
    const agent = useAgent();
    return useMutation({
        mutationFn: async () => {
            await agent.app.bsky.actor.putPreferences({ preferences: [] });
            // triggers a refetch
            await queryClient.invalidateQueries({
                queryKey: preferencesQueryKey,
            });
        },
    });
}
export function usePreferencesSetContentLabelMutation() {
    const agent = useAgent();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ label, visibility, labelerDid }) => {
            await agent.setContentLabelPref(label, visibility, labelerDid);
            logger.metric('moderation:changeLabelPreference', { preference: visibility }, { statsig: true });
            // triggers a refetch
            await queryClient.invalidateQueries({
                queryKey: preferencesQueryKey,
            });
        },
    });
}
export function useSetContentLabelMutation() {
    const queryClient = useQueryClient();
    const agent = useAgent();
    return useMutation({
        mutationFn: async ({ label, visibility, labelerDid, }) => {
            await agent.setContentLabelPref(label, visibility, labelerDid);
            // triggers a refetch
            await queryClient.invalidateQueries({
                queryKey: preferencesQueryKey,
            });
        },
    });
}
export function usePreferencesSetAdultContentMutation() {
    const queryClient = useQueryClient();
    const agent = useAgent();
    return useMutation({
        mutationFn: async ({ enabled }) => {
            await agent.setAdultContentEnabled(enabled);
            // triggers a refetch
            await queryClient.invalidateQueries({
                queryKey: preferencesQueryKey,
            });
        },
    });
}
export function usePreferencesSetBirthDateMutation() {
    const queryClient = useQueryClient();
    const agent = useAgent();
    return useMutation({
        mutationFn: async ({ birthDate }) => {
            await agent.setPersonalDetails({ birthDate: birthDate.toISOString() });
            // triggers a refetch
            await queryClient.invalidateQueries({
                queryKey: preferencesQueryKey,
            });
        },
    });
}
export function useSetFeedViewPreferencesMutation() {
    const queryClient = useQueryClient();
    const agent = useAgent();
    return useMutation({
        mutationFn: async (prefs) => {
            /*
             * special handling here, merged into `feedViewPrefs` above, since
             * following was previously called `home`
             */
            await agent.setFeedViewPrefs('home', prefs);
            // triggers a refetch
            await queryClient.invalidateQueries({
                queryKey: preferencesQueryKey,
            });
        },
    });
}
export function useSetThreadViewPreferencesMutation() {
    const queryClient = useQueryClient();
    const agent = useAgent();
    return useMutation({
        mutationFn: async (prefs) => {
            await agent.setThreadViewPrefs(prefs);
            // triggers a refetch
            await queryClient.invalidateQueries({
                queryKey: preferencesQueryKey,
            });
        },
    });
}
export function useOverwriteSavedFeedsMutation() {
    const queryClient = useQueryClient();
    const agent = useAgent();
    return useMutation({
        mutationFn: async (savedFeeds) => {
            await agent.overwriteSavedFeeds(savedFeeds);
            // triggers a refetch
            await queryClient.invalidateQueries({
                queryKey: preferencesQueryKey,
            });
        },
    });
}
export function useAddSavedFeedsMutation() {
    const queryClient = useQueryClient();
    const agent = useAgent();
    return useMutation({
        mutationFn: async (savedFeeds) => {
            await agent.addSavedFeeds(savedFeeds);
            // triggers a refetch
            await queryClient.invalidateQueries({
                queryKey: preferencesQueryKey,
            });
        },
    });
}
export function useRemoveFeedMutation() {
    const queryClient = useQueryClient();
    const agent = useAgent();
    return useMutation({
        mutationFn: async (savedFeed) => {
            await agent.removeSavedFeeds([savedFeed.id]);
            // triggers a refetch
            await queryClient.invalidateQueries({
                queryKey: preferencesQueryKey,
            });
        },
    });
}
export function useReplaceForYouWithDiscoverFeedMutation() {
    const queryClient = useQueryClient();
    const agent = useAgent();
    return useMutation({
        mutationFn: async ({ forYouFeedConfig, discoverFeedConfig, }) => {
            if (forYouFeedConfig) {
                await agent.removeSavedFeeds([forYouFeedConfig.id]);
            }
            if (!discoverFeedConfig) {
                await agent.addSavedFeeds([
                    {
                        type: 'feed',
                        value: PROD_DEFAULT_FEED('whats-hot'),
                        pinned: true,
                    },
                ]);
            }
            else {
                await agent.updateSavedFeeds([
                    {
                        ...discoverFeedConfig,
                        pinned: true,
                    },
                ]);
            }
            // triggers a refetch
            await queryClient.invalidateQueries({
                queryKey: preferencesQueryKey,
            });
        },
    });
}
export function useUpdateSavedFeedsMutation() {
    const queryClient = useQueryClient();
    const agent = useAgent();
    return useMutation({
        mutationFn: async (feeds) => {
            await agent.updateSavedFeeds(feeds);
            // triggers a refetch
            await queryClient.invalidateQueries({
                queryKey: preferencesQueryKey,
            });
        },
    });
}
export function useUpsertMutedWordsMutation() {
    const queryClient = useQueryClient();
    const agent = useAgent();
    return useMutation({
        mutationFn: async (mutedWords) => {
            await agent.upsertMutedWords(mutedWords);
            // triggers a refetch
            await queryClient.invalidateQueries({
                queryKey: preferencesQueryKey,
            });
        },
    });
}
export function useUpdateMutedWordMutation() {
    const queryClient = useQueryClient();
    const agent = useAgent();
    return useMutation({
        mutationFn: async (mutedWord) => {
            await agent.updateMutedWord(mutedWord);
            // triggers a refetch
            await queryClient.invalidateQueries({
                queryKey: preferencesQueryKey,
            });
        },
    });
}
export function useRemoveMutedWordMutation() {
    const queryClient = useQueryClient();
    const agent = useAgent();
    return useMutation({
        mutationFn: async (mutedWord) => {
            await agent.removeMutedWord(mutedWord);
            // triggers a refetch
            await queryClient.invalidateQueries({
                queryKey: preferencesQueryKey,
            });
        },
    });
}
export function useRemoveMutedWordsMutation() {
    const queryClient = useQueryClient();
    const agent = useAgent();
    return useMutation({
        mutationFn: async (mutedWords) => {
            await agent.removeMutedWords(mutedWords);
            // triggers a refetch
            await queryClient.invalidateQueries({
                queryKey: preferencesQueryKey,
            });
        },
    });
}
export function useQueueNudgesMutation() {
    const queryClient = useQueryClient();
    const agent = useAgent();
    return useMutation({
        mutationFn: async (nudges) => {
            await agent.bskyAppQueueNudges(nudges);
            // triggers a refetch
            await queryClient.invalidateQueries({
                queryKey: preferencesQueryKey,
            });
        },
    });
}
export function useDismissNudgesMutation() {
    const queryClient = useQueryClient();
    const agent = useAgent();
    return useMutation({
        mutationFn: async (nudges) => {
            await agent.bskyAppDismissNudges(nudges);
            // triggers a refetch
            await queryClient.invalidateQueries({
                queryKey: preferencesQueryKey,
            });
        },
    });
}
export function useSetActiveProgressGuideMutation() {
    const queryClient = useQueryClient();
    const agent = useAgent();
    return useMutation({
        mutationFn: async (guide) => {
            await agent.bskyAppSetActiveProgressGuide(guide);
            // triggers a refetch
            await queryClient.invalidateQueries({
                queryKey: preferencesQueryKey,
            });
        },
    });
}
export function useSetVerificationPrefsMutation() {
    const queryClient = useQueryClient();
    const agent = useAgent();
    return useMutation({
        mutationFn: async (prefs) => {
            await agent.setVerificationPrefs(prefs);
            if (prefs.hideBadges) {
                logger.metric('verification:settings:hideBadges', {}, { statsig: true });
            }
            else {
                logger.metric('verification:settings:unHideBadges', {}, { statsig: true });
            }
            // triggers a refetch
            await queryClient.invalidateQueries({
                queryKey: preferencesQueryKey,
            });
        },
    });
}
//# sourceMappingURL=index.js.map