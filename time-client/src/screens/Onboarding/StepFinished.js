import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useContext, useState } from 'react';
import { View } from 'react-native';
import Animated, { Easing, LayoutAnimationConfig, SlideInRight, SlideOutLeft, } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { AppBskyGraphStarterpack, } from '@atproto/api';
import { TID } from '@atproto/common-web';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useQueryClient } from '@tanstack/react-query';
import { uploadBlob } from '#/lib/api';
import { BSKY_APP_ACCOUNT_DID, DISCOVER_SAVED_FEED, TIMELINE_SAVED_FEED, VIDEO_SAVED_FEED, } from '#/lib/constants';
import { useRequestNotificationsPermission } from '#/lib/notifications/notifications';
import { logEvent, useGate } from '#/lib/statsig/statsig';
import { logger } from '#/logger';
import { isNative } from '#/platform/detection';
import { useSetHasCheckedForStarterPack } from '#/state/preferences/used-starter-packs';
import { getAllListMembers } from '#/state/queries/list-members';
import { preferencesQueryKey } from '#/state/queries/preferences';
import { RQKEY as profileRQKey } from '#/state/queries/profile';
import { useAgent } from '#/state/session';
import { useOnboardingDispatch } from '#/state/shell';
import { useProgressGuideControls } from '#/state/shell/progress-guide';
import { useActiveStarterPack, useSetActiveStarterPack, } from '#/state/shell/starter-pack';
import { DescriptionText, OnboardingControls, OnboardingHeaderSlot, TitleText, } from '#/screens/Onboarding/Layout';
import { Context } from '#/screens/Onboarding/state';
import { bulkWriteFollows } from '#/screens/Onboarding/util';
import { atoms as a, native, platform, tokens, useBreakpoints, useTheme, } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { IconCircle } from '#/components/IconCircle';
import { ArrowRight_Stroke2_Corner0_Rounded as ArrowRight } from '#/components/icons/Arrow';
import { Check_Stroke2_Corner0_Rounded as Check } from '#/components/icons/Check';
import { Growth_Stroke2_Corner0_Rounded as Growth } from '#/components/icons/Growth';
import { News2_Stroke2_Corner0_Rounded as News } from '#/components/icons/News2';
import { Trending2_Stroke2_Corner2_Rounded as Trending } from '#/components/icons/Trending';
import { Loader } from '#/components/Loader';
import { Text } from '#/components/Typography';
import * as bsky from '#/types/bsky';
export function StepFinished() {
    const { _ } = useLingui();
    const { state, dispatch } = useContext(Context);
    const onboardDispatch = useOnboardingDispatch();
    const [saving, setSaving] = useState(false);
    const queryClient = useQueryClient();
    const agent = useAgent();
    const requestNotificationsPermission = useRequestNotificationsPermission();
    const activeStarterPack = useActiveStarterPack();
    const setActiveStarterPack = useSetActiveStarterPack();
    const setHasCheckedForStarterPack = useSetHasCheckedForStarterPack();
    const { startProgressGuide } = useProgressGuideControls();
    const gate = useGate();
    const finishOnboarding = useCallback(async () => {
        setSaving(true);
        let starterPack;
        let listItems;
        if (activeStarterPack?.uri) {
            try {
                const spRes = await agent.app.bsky.graph.getStarterPack({
                    starterPack: activeStarterPack.uri,
                });
                starterPack = spRes.data.starterPack;
            }
            catch (e) {
                logger.error('Failed to fetch starter pack', { safeMessage: e });
                // don't tell the user, just get them through onboarding.
            }
            try {
                if (starterPack?.list) {
                    listItems = await getAllListMembers(agent, starterPack.list.uri);
                }
            }
            catch (e) {
                logger.error('Failed to fetch starter pack list items', {
                    safeMessage: e,
                });
                // don't tell the user, just get them through onboarding.
            }
        }
        try {
            const { interestsStepResults, profileStepResults } = state;
            const { selectedInterests } = interestsStepResults;
            await Promise.all([
                bulkWriteFollows(agent, [
                    BSKY_APP_ACCOUNT_DID,
                    ...(listItems?.map(i => i.subject.did) ?? []),
                ]),
                (async () => {
                    // Interests need to get saved first, then we can write the feeds to prefs
                    await agent.setInterestsPref({ tags: selectedInterests });
                    // Default feeds that every user should have pinned when landing in the app
                    const feedsToSave = [
                        {
                            ...DISCOVER_SAVED_FEED,
                            id: TID.nextStr(),
                        },
                        {
                            ...TIMELINE_SAVED_FEED,
                            id: TID.nextStr(),
                        },
                    ];
                    if (gate('onboarding_add_video_feed')) {
                        feedsToSave.push({
                            ...VIDEO_SAVED_FEED,
                            id: TID.nextStr(),
                        });
                    }
                    // Any starter pack feeds will be pinned _after_ the defaults
                    if (starterPack && starterPack.feeds?.length) {
                        feedsToSave.push(...starterPack.feeds.map(f => ({
                            type: 'feed',
                            value: f.uri,
                            pinned: true,
                            id: TID.nextStr(),
                        })));
                    }
                    await agent.overwriteSavedFeeds(feedsToSave);
                })(),
                (async () => {
                    const { imageUri, imageMime } = profileStepResults;
                    const blobPromise = imageUri && imageMime
                        ? uploadBlob(agent, imageUri, imageMime)
                        : undefined;
                    await agent.upsertProfile(async (existing) => {
                        let next = existing ?? {};
                        if (blobPromise) {
                            const res = await blobPromise;
                            if (res.data.blob) {
                                next.avatar = res.data.blob;
                            }
                        }
                        if (starterPack) {
                            next.joinedViaStarterPack = {
                                uri: starterPack.uri,
                                cid: starterPack.cid,
                            };
                        }
                        next.displayName = '';
                        // HACKFIX
                        // creating a bunch of identical profile objects is breaking the relay
                        // tossing this unspecced field onto it to reduce the size of the problem
                        // -prf
                        next.createdAt = new Date().toISOString();
                        return next;
                    });
                    logEvent('onboarding:finished:avatarResult', {
                        avatarResult: profileStepResults.isCreatedAvatar
                            ? 'created'
                            : profileStepResults.image
                                ? 'uploaded'
                                : 'default',
                    });
                })(),
                requestNotificationsPermission('AfterOnboarding'),
            ]);
        }
        catch (e) {
            logger.info(`onboarding: bulk save failed`);
            logger.error(e);
            // don't alert the user, just let them into their account
        }
        // Try to ensure that prefs and profile are up-to-date by the time we render Home.
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: preferencesQueryKey,
            }),
            queryClient.invalidateQueries({
                queryKey: profileRQKey(agent.session?.did ?? ''),
            }),
        ]).catch(e => {
            logger.error(e);
            // Keep going.
        });
        setSaving(false);
        setActiveStarterPack(undefined);
        setHasCheckedForStarterPack(true);
        startProgressGuide(gate('old_postonboarding') ? 'like-10-and-follow-7' : 'follow-10');
        dispatch({ type: 'finish' });
        onboardDispatch({ type: 'finish' });
        logEvent('onboarding:finished:nextPressed', {
            usedStarterPack: Boolean(starterPack),
            starterPackName: starterPack &&
                bsky.dangerousIsType(starterPack.record, AppBskyGraphStarterpack.isRecord)
                ? starterPack.record.name
                : undefined,
            starterPackCreator: starterPack?.creator.did,
            starterPackUri: starterPack?.uri,
            profilesFollowed: listItems?.length ?? 0,
            feedsPinned: starterPack?.feeds?.length ?? 0,
        });
        if (starterPack && listItems?.length) {
            logEvent('starterPack:followAll', {
                logContext: 'Onboarding',
                starterPack: starterPack.uri,
                count: listItems?.length,
            });
        }
    }, [
        queryClient,
        agent,
        dispatch,
        onboardDispatch,
        activeStarterPack,
        state,
        requestNotificationsPermission,
        setActiveStarterPack,
        setHasCheckedForStarterPack,
        startProgressGuide,
        gate,
    ]);
    return state.experiments?.onboarding_value_prop ? (_jsx(ValueProposition, { finishOnboarding: finishOnboarding, saving: saving, state: state })) : (_jsx(LegacyFinalStep, { finishOnboarding: finishOnboarding, saving: saving, state: state }));
}
const PROP_1 = {
    light: platform({
        native: require('../../../assets/images/onboarding/value_prop_1_light.webp'),
        web: require('../../../assets/images/onboarding/value_prop_1_light_borderless.webp'),
    }),
    dim: platform({
        native: require('../../../assets/images/onboarding/value_prop_1_dim.webp'),
        web: require('../../../assets/images/onboarding/value_prop_1_dim_borderless.webp'),
    }),
    dark: platform({
        native: require('../../../assets/images/onboarding/value_prop_1_dark.webp'),
        web: require('../../../assets/images/onboarding/value_prop_1_dark_borderless.webp'),
    }),
};
const PROP_2 = {
    light: require('../../../assets/images/onboarding/value_prop_2_light.webp'),
    dim: require('../../../assets/images/onboarding/value_prop_2_dim.webp'),
    dark: require('../../../assets/images/onboarding/value_prop_2_dark.webp'),
};
const PROP_3 = {
    light: require('../../../assets/images/onboarding/value_prop_3_light.webp'),
    dim: require('../../../assets/images/onboarding/value_prop_3_dim.webp'),
    dark: require('../../../assets/images/onboarding/value_prop_3_dark.webp'),
};
function ValueProposition({ finishOnboarding, saving, state, }) {
    const [subStep, setSubStep] = useState(0);
    const t = useTheme();
    const { _ } = useLingui();
    const { gtMobile } = useBreakpoints();
    const image = [PROP_1[t.name], PROP_2[t.name], PROP_3[t.name]][subStep];
    const onPress = () => {
        if (subStep === 2) {
            finishOnboarding(); // has its own metrics
        }
        else if (subStep === 1) {
            setSubStep(2);
            logger.metric('onboarding:valueProp:stepTwo:nextPressed', {});
        }
        else if (subStep === 0) {
            setSubStep(1);
            logger.metric('onboarding:valueProp:stepOne:nextPressed', {});
        }
    };
    const { title, description, alt } = [
        {
            title: _(msg `Free your feed`),
            description: _(msg `No more doomscrolling junk-filled algorithms. Find feeds that work for you, not against you.`),
            alt: _(msg `A collection of popular feeds you can find on Bluesky, including News, Booksky, Game Dev, Blacksky, and Fountain Pens`),
        },
        {
            title: _(msg `Find your people`),
            description: _(msg `Ditch the trolls and clickbait. Find real people and conversations that matter to you.`),
            alt: _(msg `Your profile picture surrounded by concentric circles of other users' profile pictures`),
        },
        {
            title: _(msg `Forget the noise`),
            description: _(msg `No ads, no invasive tracking, no engagement traps. Bluesky respects your time and attention.`),
            alt: _(msg `An illustration of several Bluesky posts alongside repost, like, and comment icons`),
        },
    ][subStep];
    return (_jsxs(_Fragment, { children: [!gtMobile && (_jsx(OnboardingHeaderSlot.Portal, { children: _jsx(Button, { disabled: saving, variant: "ghost", color: "secondary", size: "small", label: _(msg `Skip introduction and start using your account`), onPress: () => {
                        logger.metric('onboarding:valueProp:skipPressed', {});
                        finishOnboarding();
                    }, style: [a.bg_transparent], children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Skip" }) }) }) })), _jsx(LayoutAnimationConfig, { skipEntering: true, skipExiting: true, children: _jsxs(Animated.View, { entering: native(SlideInRight.easing(Easing.out(Easing.exp)).duration(500)), exiting: native(SlideOutLeft.easing(Easing.out(Easing.exp)).duration(500)), children: [_jsxs(View, { style: [
                                a.relative,
                                a.align_center,
                                a.justify_center,
                                isNative && { marginHorizontal: tokens.space.xl * -1 },
                                a.pointer_events_none,
                            ], children: [_jsx(Image, { source: image, style: [a.w_full, { aspectRatio: 1 }], alt: alt, accessibilityIgnoresInvertColors: false }), subStep === 1 && (_jsx(Image, { source: state.profileStepResults.imageUri, style: [
                                        a.z_10,
                                        a.absolute,
                                        a.rounded_full,
                                        {
                                            width: `${(80 / 393) * 100}%`,
                                            height: `${(80 / 393) * 100}%`,
                                        },
                                    ], accessibilityIgnoresInvertColors: true, alt: _(msg `Your profile picture`) }))] }), _jsxs(View, { style: [a.mt_4xl, a.gap_2xl, a.align_center], children: [_jsxs(View, { style: [a.flex_row, a.gap_sm], children: [_jsx(Dot, { active: subStep === 0 }), _jsx(Dot, { active: subStep === 1 }), _jsx(Dot, { active: subStep === 2 })] }), _jsxs(View, { style: [a.gap_sm], children: [_jsx(Text, { style: [a.font_heavy, a.text_3xl, a.text_center], children: title }), _jsx(Text, { style: [
                                                t.atoms.text_contrast_medium,
                                                a.text_md,
                                                a.leading_snug,
                                                a.text_center,
                                            ], children: description })] })] })] }, subStep) }), _jsx(OnboardingControls.Portal, { children: _jsxs(View, { style: gtMobile && [a.gap_md, a.flex_row], children: [gtMobile && (_jsx(Button, { disabled: saving, color: "secondary", size: "large", label: _(msg `Skip introduction and start using your account`), onPress: () => finishOnboarding(), children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Skip" }) }) })), _jsxs(Button, { disabled: saving, color: "primary", size: "large", label: subStep === 2
                                ? _(msg `Complete onboarding and start using your account`)
                                : _(msg `Next`), onPress: onPress, children: [_jsx(ButtonText, { children: saving ? (_jsx(Trans, { children: "Finalizing" })) : subStep === 2 ? (_jsx(Trans, { children: "Let's go!" })) : (_jsx(Trans, { children: "Next" })) }), subStep === 2 && (_jsx(ButtonIcon, { icon: saving ? Loader : ArrowRight }))] }, state.activeStep)] }) })] }));
}
function Dot({ active }) {
    const t = useTheme();
    const { _ } = useLingui();
    return (_jsx(View, { style: [
            a.rounded_full,
            { width: 8, height: 8 },
            active
                ? { backgroundColor: t.palette.primary_500 }
                : t.atoms.bg_contrast_50,
        ] }));
}
function LegacyFinalStep({ finishOnboarding, saving, state, }) {
    const t = useTheme();
    const { _ } = useLingui();
    return (_jsxs(View, { style: [a.align_start], children: [_jsx(IconCircle, { icon: Check, style: [a.mb_2xl] }), _jsx(TitleText, { children: _jsx(Trans, { children: "You're ready to go!" }) }), _jsx(DescriptionText, { children: _jsx(Trans, { children: "We hope you have a wonderful time. Remember, Bluesky is:" }) }), _jsxs(View, { style: [a.pt_5xl, a.gap_3xl], children: [_jsxs(View, { style: [a.flex_row, a.align_center, a.w_full, a.gap_lg], children: [_jsx(IconCircle, { icon: Growth, size: "lg", style: { width: 48, height: 48 } }), _jsxs(View, { style: [a.flex_1, a.gap_xs], children: [_jsx(Text, { style: [a.font_bold, a.text_lg], children: _jsx(Trans, { children: "Public" }) }), _jsx(Text, { style: [t.atoms.text_contrast_medium, a.text_md, a.leading_snug], children: _jsx(Trans, { children: "Your posts, likes, and blocks are public. Mutes are private." }) })] })] }), _jsxs(View, { style: [a.flex_row, a.align_center, a.w_full, a.gap_lg], children: [_jsx(IconCircle, { icon: News, size: "lg", style: { width: 48, height: 48 } }), _jsxs(View, { style: [a.flex_1, a.gap_xs], children: [_jsx(Text, { style: [a.font_bold, a.text_lg], children: _jsx(Trans, { children: "Open" }) }), _jsx(Text, { style: [t.atoms.text_contrast_medium, a.text_md, a.leading_snug], children: _jsx(Trans, { children: "Never lose access to your followers or data." }) })] })] }), _jsxs(View, { style: [a.flex_row, a.align_center, a.w_full, a.gap_lg], children: [_jsx(IconCircle, { icon: Trending, size: "lg", style: { width: 48, height: 48 } }), _jsxs(View, { style: [a.flex_1, a.gap_xs], children: [_jsx(Text, { style: [a.font_bold, a.text_lg], children: _jsx(Trans, { children: "Flexible" }) }), _jsx(Text, { style: [t.atoms.text_contrast_medium, a.text_md, a.leading_snug], children: _jsx(Trans, { children: "Choose the algorithms that power your custom feeds." }) })] })] })] }), _jsx(OnboardingControls.Portal, { children: _jsxs(Button, { testID: "onboardingFinish", disabled: saving, color: "primary", size: "large", label: _(msg `Complete onboarding and start using your account`), onPress: finishOnboarding, children: [_jsx(ButtonText, { children: saving ? _jsx(Trans, { children: "Finalizing" }) : _jsx(Trans, { children: "Let's go!" }) }), saving && _jsx(ButtonIcon, { icon: Loader, position: "right" })] }, state.activeStep) })] }));
}
//# sourceMappingURL=StepFinished.js.map