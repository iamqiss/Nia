import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { AppBskyGraphDefs, AppBskyGraphStarterpack, AtUri, } from '@atproto/api';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { isAndroidWeb } from '#/lib/browser';
import { JOINED_THIS_WEEK } from '#/lib/constants';
import { useWebMediaQueries } from '#/lib/hooks/useWebMediaQueries';
import { logEvent } from '#/lib/statsig/statsig';
import { createStarterPackGooglePlayUri } from '#/lib/strings/starter-pack';
import { isWeb } from '#/platform/detection';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { useStarterPackQuery } from '#/state/queries/starter-packs';
import { useActiveStarterPack, useSetActiveStarterPack, } from '#/state/shell/starter-pack';
import { LoggedOutScreenState } from '#/view/com/auth/LoggedOut';
import { formatCount } from '#/view/com/util/numeric/format';
import { Logo } from '#/view/icons/Logo';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import { useDialogControl } from '#/components/Dialog';
import * as FeedCard from '#/components/FeedCard';
import { useRichText } from '#/components/hooks/useRichText';
import * as Layout from '#/components/Layout';
import { LinearGradientBackground } from '#/components/LinearGradientBackground';
import { ListMaybePlaceholder } from '#/components/Lists';
import { Default as ProfileCard } from '#/components/ProfileCard';
import * as Prompt from '#/components/Prompt';
import { RichText } from '#/components/RichText';
import { Text } from '#/components/Typography';
import * as bsky from '#/types/bsky';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export function postAppClipMessage(message) {
    // @ts-expect-error safari webview only
    window.webkit.messageHandlers.onMessage.postMessage(JSON.stringify(message));
}
export function LandingScreen({ setScreenState, }) {
    const moderationOpts = useModerationOpts();
    const activeStarterPack = useActiveStarterPack();
    const { data: starterPack, isError: isErrorStarterPack, isFetching, } = useStarterPackQuery({
        uri: activeStarterPack?.uri,
    });
    const isValid = starterPack &&
        starterPack.list &&
        AppBskyGraphDefs.validateStarterPackView(starterPack) &&
        AppBskyGraphStarterpack.validateRecord(starterPack.record);
    React.useEffect(() => {
        if (isErrorStarterPack || (starterPack && !isValid)) {
            setScreenState(LoggedOutScreenState.S_LoginOrCreateAccount);
        }
    }, [isErrorStarterPack, setScreenState, isValid, starterPack]);
    if (isFetching || !starterPack || !isValid || !moderationOpts) {
        return _jsx(ListMaybePlaceholder, { isLoading: true });
    }
    // Just for types, this cannot be hit
    if (!bsky.dangerousIsType(starterPack.record, AppBskyGraphStarterpack.isRecord)) {
        return null;
    }
    return (_jsx(LandingScreenLoaded, { starterPack: starterPack, starterPackRecord: starterPack.record, setScreenState: setScreenState, moderationOpts: moderationOpts }));
}
function LandingScreenLoaded({ starterPack, starterPackRecord: record, setScreenState, 
// TODO apply this to profile card
moderationOpts, }) {
    const { creator, listItemsSample, feeds } = starterPack;
    const { _, i18n } = useLingui();
    const t = useTheme();
    const activeStarterPack = useActiveStarterPack();
    const setActiveStarterPack = useSetActiveStarterPack();
    const { isTabletOrDesktop } = useWebMediaQueries();
    const androidDialogControl = useDialogControl();
    const [descriptionRt] = useRichText(record.description || '');
    const [appClipOverlayVisible, setAppClipOverlayVisible] = React.useState(false);
    const listItemsCount = starterPack.list?.listItemCount ?? 0;
    const onContinue = () => {
        setScreenState(LoggedOutScreenState.S_CreateAccount);
    };
    const onJoinPress = () => {
        if (activeStarterPack?.isClip) {
            setAppClipOverlayVisible(true);
            postAppClipMessage({
                action: 'present',
            });
        }
        else if (isAndroidWeb) {
            androidDialogControl.open();
        }
        else {
            onContinue();
        }
        logEvent('starterPack:ctaPress', {
            starterPack: starterPack.uri,
        });
    };
    const onJoinWithoutPress = () => {
        if (activeStarterPack?.isClip) {
            setAppClipOverlayVisible(true);
            postAppClipMessage({
                action: 'present',
            });
        }
        else {
            setActiveStarterPack(undefined);
            setScreenState(LoggedOutScreenState.S_CreateAccount);
        }
    };
    return (_jsxs(View, { style: [a.flex_1], children: [_jsxs(Layout.Content, { ignoreTabletLayoutOffset: true, children: [_jsxs(LinearGradientBackground, { style: [
                            a.align_center,
                            a.gap_sm,
                            a.px_lg,
                            a.py_2xl,
                            isTabletOrDesktop && [a.mt_2xl, a.rounded_md],
                            activeStarterPack?.isClip && {
                                paddingTop: 100,
                            },
                        ], children: [_jsx(View, { style: [a.flex_row, a.gap_md, a.pb_sm], children: _jsx(Logo, { width: 76, fill: "white" }) }), _jsx(Text, { style: [
                                    a.font_bold,
                                    a.text_4xl,
                                    a.text_center,
                                    a.leading_tight,
                                    { color: 'white' },
                                ], children: record.name }), _jsxs(Text, { style: [a.text_center, a.font_bold, a.text_md, { color: 'white' }], children: ["Starter pack by ", `@${creator.handle}`] })] }), _jsxs(View, { style: [a.gap_2xl, a.mx_lg, a.my_2xl], children: [record.description ? (_jsx(RichText, { value: descriptionRt, style: [a.text_md] })) : null, _jsxs(View, { style: [a.gap_sm], children: [_jsx(Button, { label: _(msg `Join Bluesky`), onPress: onJoinPress, variant: "solid", color: "primary", size: "large", children: _jsx(ButtonText, { style: [a.text_lg], children: _jsx(Trans, { children: "Join Bluesky" }) }) }), _jsxs(View, { style: [a.flex_row, a.align_center, a.gap_sm], children: [_jsx(FontAwesomeIcon, { icon: "arrow-trend-up", size: 12, color: t.atoms.text_contrast_medium.color }), _jsx(Text, { style: [a.font_bold, a.text_sm, t.atoms.text_contrast_medium], numberOfLines: 1, children: _jsxs(Trans, { children: [formatCount(i18n, JOINED_THIS_WEEK), " joined this week"] }) })] })] }), _jsxs(View, { style: [a.gap_3xl], children: [Boolean(listItemsSample?.length) && (_jsxs(View, { style: [a.gap_md], children: [_jsx(Text, { style: [a.font_heavy, a.text_lg], children: listItemsCount <= 8 ? (_jsx(Trans, { children: "You'll follow these people right away" })) : (_jsxs(Trans, { children: ["You'll follow these people and ", listItemsCount - 8, " others"] })) }), _jsx(View, { style: isTabletOrDesktop && [
                                                    a.border,
                                                    a.rounded_md,
                                                    t.atoms.border_contrast_low,
                                                ], children: starterPack.listItemsSample
                                                    ?.filter(p => !p.subject.associated?.labeler)
                                                    .slice(0, 8)
                                                    .map((item, i) => (_jsx(View, { style: [
                                                        a.py_lg,
                                                        a.px_md,
                                                        (!isTabletOrDesktop || i !== 0) && a.border_t,
                                                        t.atoms.border_contrast_low,
                                                        { pointerEvents: 'none' },
                                                    ], children: _jsx(ProfileCard, { profile: item.subject, moderationOpts: moderationOpts }) }, item.subject.did))) })] })), feeds?.length ? (_jsxs(View, { style: [a.gap_md], children: [_jsx(Text, { style: [a.font_heavy, a.text_lg], children: _jsx(Trans, { children: "You'll stay updated with these feeds" }) }), _jsx(View, { style: [
                                                    { pointerEvents: 'none' },
                                                    isTabletOrDesktop && [
                                                        a.border,
                                                        a.rounded_md,
                                                        t.atoms.border_contrast_low,
                                                    ],
                                                ], children: feeds?.map((feed, i) => (_jsx(View, { style: [
                                                        a.py_lg,
                                                        a.px_md,
                                                        (!isTabletOrDesktop || i !== 0) && a.border_t,
                                                        t.atoms.border_contrast_low,
                                                    ], children: _jsx(FeedCard.Default, { view: feed }) }, feed.uri))) })] })) : null] }), _jsx(Button, { label: _(msg `Create an account without using this starter pack`), variant: "solid", color: "secondary", size: "large", style: [a.py_lg], onPress: onJoinWithoutPress, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Create an account without using this starter pack" }) }) })] })] }), _jsx(AppClipOverlay, { visible: appClipOverlayVisible, setIsVisible: setAppClipOverlayVisible }), _jsxs(Prompt.Outer, { control: androidDialogControl, children: [_jsx(Prompt.TitleText, { children: _jsx(Trans, { children: "Download Bluesky" }) }), _jsx(Prompt.DescriptionText, { children: _jsx(Trans, { children: "The experience is better in the app. Download Bluesky now and we'll pick back up where you left off." }) }), _jsxs(Prompt.Actions, { children: [_jsx(Prompt.Action, { cta: "Download on Google Play", color: "primary", onPress: () => {
                                    const rkey = new AtUri(starterPack.uri).rkey;
                                    if (!rkey)
                                        return;
                                    const googlePlayUri = createStarterPackGooglePlayUri(creator.handle, rkey);
                                    if (!googlePlayUri)
                                        return;
                                    window.location.href = googlePlayUri;
                                } }), _jsx(Prompt.Action, { cta: "Continue on web", color: "secondary", onPress: onContinue })] })] }), isWeb && (_jsx("meta", { name: "apple-itunes-app", content: "app-id=xyz.blueskyweb.app, app-clip-bundle-id=xyz.blueskyweb.app.AppClip, app-clip-display=card" }))] }));
}
export function AppClipOverlay({ visible, setIsVisible, }) {
    if (!visible)
        return;
    return (_jsx(AnimatedPressable, { accessibilityRole: "button", style: [
            a.absolute,
            a.inset_0,
            {
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                zIndex: 1,
            },
        ], entering: FadeIn, exiting: FadeOut, onPress: () => setIsVisible(false), children: _jsx(View, { style: [a.flex_1, a.px_lg, { marginTop: 250 }], children: _jsxs(View, { style: [a.gap_md, { zIndex: 2 }], children: [_jsx(Text, { style: [a.font_bold, a.text_4xl, { lineHeight: 40, color: 'white' }], children: "Download Bluesky to get started!" }), _jsx(Text, { style: [a.text_lg, { color: 'white' }], children: "We'll remember the starter pack you chose and use it when you create an account in the app." })] }) }) }));
}
//# sourceMappingURL=StarterPackLandingScreen.js.map